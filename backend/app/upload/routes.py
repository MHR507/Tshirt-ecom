from flask import Blueprint, request, jsonify
from ..supabase_client import create_signed_upload_url

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/sign-url", methods=["POST"])
def sign_url():
    data = request.get_json() or {}
    bucket = data.get("bucket", "public")
    path = data.get("path")
    if not path:
        return jsonify({"message":"path required"}), 400
    signed = create_signed_upload_url(bucket=bucket, path=path, expires_in=3600)
    return jsonify(signed)