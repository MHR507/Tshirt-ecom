from flask import Blueprint, request, jsonify
from ..supabase_client import call_postgrest, verify_token_get_user, upload_file_to_storage
import uuid

products_bp = Blueprint("products", __name__)

@products_bp.route("/", methods=["GET"])
def list_products():
    rows = call_postgrest("products", method="GET", params={"select":"*"})
    return jsonify(rows)

@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    row = call_postgrest("products", method="GET", params={"select":"*", "id": f"eq.{product_id}"})
    if not row:
        return jsonify({"message":"not found"}), 404
    return jsonify(row[0])

@products_bp.route("/", methods=["POST"])
def create_product():
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    
    uid = user.get("id")
    prof = call_postgrest("profiles", method="GET", params={"select":"role,id", "id": f"eq.{uid}"})
    if not prof or prof[0].get("role") not in ("designer","admin"):
        return jsonify({"message":"forbidden"}), 403
    
    # Handle multipart form data (file upload)
    if 'image' in request.files:
        file = request.files['image']
        if file.filename:
            # Generate unique filename
            ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'png'
            filename = f"{uuid.uuid4()}.{ext}"
            
            # Upload to Supabase Storage
            content_type = file.content_type or 'image/png'
            public_url = upload_file_to_storage(
                bucket="product-images",
                path=filename,
                file_data=file.read(),
                content_type=content_type
            )
            
            payload = {
                "title": request.form.get("title"),
                "description": request.form.get("description"),
                "price": float(request.form.get("price", 0)),
                "category": request.form.get("category", "tops"),
                "storage_path": filename,
                "image_url": public_url,
                "owner": uid
            }
    else:
        # JSON request (URL-based)
        data = request.get_json() or {}
        payload = {
            "title": data.get("title"),
            "description": data.get("description"),
            "price": data.get("price"),
            "image_url": data.get("image_url"),
            "category": data.get("category","tops"),
            "owner": uid
        }
    
    if not payload.get("title") or payload.get("price") is None:
        return jsonify({"message":"title and price required"}), 400
    
    created = call_postgrest("products", method="POST", json=payload)
    return jsonify(created), 201

@products_bp.route("/<product_id>", methods=["PUT"])
def edit_product(product_id):
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    
    # Check ownership
    existing = call_postgrest("products", method="GET", params={"select":"owner", "id": f"eq.{product_id}"})
    if not existing or existing[0].get("owner") != user.get("id"):
        return jsonify({"message":"forbidden"}), 403
    
    data = request.get_json() or {}
    updated = call_postgrest(f"products?id=eq.{product_id}", method="PATCH", json=data)
    return jsonify(updated)

@products_bp.route("/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    auth = request.headers.get("Authorization","")
    token = auth.split("Bearer ")[-1] if auth else None
    user = verify_token_get_user(token)
    if not user:
        return jsonify({"message":"unauthorized"}), 401
    
    existing = call_postgrest("products", method="GET", params={"select":"owner", "id": f"eq.{product_id}"})
    if not existing or existing[0].get("owner") != user.get("id"):
        return jsonify({"message":"forbidden"}), 403
    
    call_postgrest(f"products?id=eq.{product_id}", method="DELETE")
    return jsonify({"message":"deleted"}), 200