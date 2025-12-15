import os
from flask import Blueprint, request, jsonify, current_app
import requests

tryon_bp = Blueprint("tryon", __name__)

@tryon_bp.route("/", methods=["POST"])
def proxy_tryon():
    payload = request.get_json() or {}
    model_name = payload.get("model_name", "tryon-v1.6")
    inputs = payload.get("inputs", {})
    api_key = current_app.config.get("FASHN_API_KEY") or os.getenv("FASHN_API_KEY")
    if not api_key:
        return jsonify({"message":"FASHN_API_KEY not set"}), 500
    url = "https://api.fashn.ai/v1/run"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    body = {"model_name": model_name, "inputs": inputs}
    try:
        r = requests.post(url, json=body, headers=headers, timeout=120)
        r.raise_for_status()
        return jsonify(r.json())
    except requests.RequestException as exc:
        return jsonify({"message":"upstream error", "error": str(exc)}), 502