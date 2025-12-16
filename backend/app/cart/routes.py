from flask import Blueprint, request, jsonify
from ..supabase_client import call_postgrest, verify_token_get_user

cart_bp = Blueprint("cart", __name__)

@cart_bp.route("/", methods=["GET"])
def get_cart():
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    uid = user.get("id")
    params = {"select": "id,product_id,quantity,product:products(title,price,image_url)", "user_id": f"eq.{uid}"}
    items = call_postgrest("cart_items", method="GET", params=params)
    return jsonify({"items": items})

@cart_bp.route("/add", methods=["POST"])
def add_item():
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    uid = user.get("id")
    data = request.get_json() or {}
    product_id = data.get("product_id")
    quantity = int(data.get("quantity",1))
    if not product_id:
        return jsonify({"message":"product_id required"}), 400
    payload = {"user_id": uid, "product_id": product_id, "quantity": quantity}
    created = call_postgrest("cart_items", method="POST", json=payload)
    return jsonify({"item": created}), 201

@cart_bp.route("/remove", methods=["POST"])
def remove_item():
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    uid = user.get("id")
    data = request.get_json() or {}
    item_id = data.get("item_id")
    if not item_id:
        return jsonify({"message":"item_id required"}), 400
    # delete where id=eq.item_id and user_id=eq.uid
    call_postgrest(f"cart_items?id=eq.{item_id}&user_id=eq.{uid}", method="DELETE")
    return jsonify({"message":"removed"})