from flask import Blueprint, request, jsonify, current_app
from ..supabase_client import admin_create_user, login_user, call_postgrest, verify_token_get_user
from ..supabase_client import REST_BASE
import requests

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name") or ""
    role = data.get("role", "customer")
    if not email or not password:
        return jsonify({"message":"email and password required"}), 400

    try:
        # create user via admin endpoint (returns user object with id)
        user = admin_create_user(email=email, password=password, user_metadata={"full_name": name, "role": role})
    except requests.HTTPError as e:
        # return upstream error body if available
        msg = getattr(e.response, "text", str(e))
        return jsonify({"message":"failed creating auth user", "error": msg}), 400
    except Exception as e:
        return jsonify({"message":"failed creating auth user", "error": str(e)}), 400

    # admin_create_user returns user object with "id"
    uid = user.get("id")
    if not uid:
        return jsonify({"message":"user created but id missing", "raw": user}), 201

    # create profile row in public.profiles using service role
    try:
        payload = {"id": uid, "full_name": name, "role": role}
        profile = call_postgrest("profiles", method="POST", json=payload)
        return jsonify({"message":"registered", "user": {"id": uid, "email": email, "role": role}}), 201
    except Exception as e:
        # user created in auth but profile failed
        return jsonify({"message":"registered but failed to create profile", "error": str(e), "user_id": uid}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"message":"email and password required"}), 400

    try:
        token_resp = login_user(email=email, password=password)
        # token_resp contains access_token, refresh_token, user
        return jsonify(token_resp)
    except requests.HTTPError as e:
        # show upstream response body for debugging
        body = getattr(e.response, "text", None)
        try:
            return jsonify({"message":"invalid credentials or auth error", "error": e.response.json()}), 401
        except Exception:
            return jsonify({"message":"invalid credentials or auth error", "error": body or str(e)}), 401
    except Exception as e:
        return jsonify({"message":"login failed", "error": str(e)}), 500

@auth_bp.route("/me", methods=["GET"])
def me():
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    return jsonify(user)