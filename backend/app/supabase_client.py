import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is not set in env")
if not SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not set in env")

REST_BASE = SUPABASE_URL.rstrip("/") + "/rest/v1"
AUTH_BASE = SUPABASE_URL.rstrip("/") + "/auth/v1"
STORAGE_BASE = SUPABASE_URL.rstrip("/") + "/storage/v1"

HEADERS_SERVICE = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}

HEADERS_ANON = {
    "apikey": ANON_KEY or SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
}

def _req_raise(res: requests.Response):
    if not res.ok:
        http_error = requests.HTTPError(f"{res.status_code} {res.reason}")
        http_error.response = res
        raise http_error
    if res.text:
        try:
            return res.json()
        except ValueError:
            return res.text
    return None

def call_postgrest(path: str, method: str = "GET", params: dict | None = None, json: dict | None = None):
    url = f"{REST_BASE}/{path}"
    res = requests.request(method, url, headers=HEADERS_SERVICE, params=params, json=json, timeout=30)
    return _req_raise(res)

def verify_token_get_user(supabase_jwt: str):
    if not supabase_jwt:
        return None
    url = f"{AUTH_BASE}/user"
    headers = {"Authorization": f"Bearer {supabase_jwt}", "apikey": ANON_KEY or SERVICE_ROLE_KEY}
    res = requests.get(url, headers=headers, timeout=10)
    if res.status_code != 200:
        return None
    return res.json()

def admin_create_user(email: str, password: str, user_metadata: dict | None = None, auto_confirm: bool = True):
    url = f"{AUTH_BASE}/admin/users"
    payload = {"email": email, "password": password}
    if user_metadata:
        payload["user_metadata"] = user_metadata
    if auto_confirm:
        payload["email_confirm"] = True
    res = requests.post(url, headers=HEADERS_SERVICE, json=payload, timeout=15)
    return _req_raise(res)

def login_user(email: str, password: str):
    url = f"{AUTH_BASE}/token?grant_type=password"
    payload = {"email": email, "password": password}
    res = requests.post(url, headers=HEADERS_ANON, json=payload, timeout=15)
    return _req_raise(res)

def upload_file_to_storage(bucket: str, path: str, file_data: bytes, content_type: str = "image/png"):
    """
    Upload file to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    url = f"{STORAGE_BASE}/object/{bucket}/{path}"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": content_type,
    }
    res = requests.post(url, headers=headers, data=file_data, timeout=30)
    _req_raise(res)
    # Return public URL
    return f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"

def create_signed_upload_url(bucket: str, path: str, expires_in: int = 3600):
    url = f"{STORAGE_BASE}/object/sign/{bucket}/{path}"
    res = requests.post(url, headers=HEADERS_SERVICE, json={"expires_in": expires_in}, timeout=10)
    return _req_raise(res)