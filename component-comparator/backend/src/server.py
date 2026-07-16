from flask import Flask, request, jsonify, abort
import json
import os
import time
from rules import check_all_compatibility

app = Flask(__name__)

# Global variables
COMPONENTS_DB = []
COMPATIBILITY_CACHE = {}
IP_REQUESTS = {}

# Load database on startup
DB_PATH = os.path.join(os.path.dirname(__file__), "../data/components.json")
try:
    with open(DB_PATH, "r", encoding="utf-8") as f:
        COMPONENTS_DB = json.load(f)
    print(f"Loaded {len(COMPONENTS_DB)} components from components.json.")
except Exception as e:
    print(f"Error loading components database: {e}")

# Rate limiter helper
def is_rate_limited(ip):
    now = time.time()
    if ip not in IP_REQUESTS:
        IP_REQUESTS[ip] = []
    
    # Filter out timestamps older than 60 seconds
    IP_REQUESTS[ip] = [t for t in IP_REQUESTS[ip] if now - t < 60]
    
    if len(IP_REQUESTS[ip]) >= 30:
        return True # limit exceeded
    
    IP_REQUESTS[ip].append(now)
    return False

# Manual CORS configuration
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

# Routes
@app.route("/api/components", methods=["GET"])
def get_components():
    category = request.args.get("category")
    if category:
        filtered = [c for c in COMPONENTS_DB if c.get("category", "").strip().lower() == category.strip().lower()]
        return jsonify(filtered)
    return jsonify(COMPONENTS_DB)

@app.route("/api/components/<component_id>", methods=["GET"])
def get_component_by_id(component_id):
    component = next((c for c in COMPONENTS_DB if c.get("id") == component_id), None)
    if not component:
        return jsonify({"error": "Componente no encontrado."}), 404
    return jsonify(component)

@app.route("/api/compatibility/check", methods=["POST", "OPTIONS"])
def check_compatibility():
    if request.method == "OPTIONS":
        return "", 200

    # Rate Limiting
    ip = request.remote_addr or "unknown"
    if is_rate_limited(ip):
        return jsonify({
            "status": "ERROR",
            "message": "Demasiadas solicitudes de compatibilidad. Por favor, intenta de nuevo en un minuto."
        }), 429

    data = request.get_json() or {}
    ids = data.get("ids")

    if ids is None or not isinstance(ids, list):
        return jsonify({"error": "Se requiere una lista 'ids' de identificadores de componentes."}), 400

    if not ids:
        return jsonify({
            "overallStatus": "COMPATIBLE",
            "rulesEvaluated": []
        })

    # Cache key: sorted combination of selected component IDs
    cache_key = ",".join(sorted(ids))
    if cache_key in COMPATIBILITY_CACHE:
        print(f"[CACHE HIT] Returning cached compatibility report for: [{cache_key}]")
        return jsonify(COMPATIBILITY_CACHE[cache_key])

    # Find the corresponding component records
    selected_components = []
    for cid in ids:
        comp = next((c for c in COMPONENTS_DB if c.get("id") == cid), None)
        if comp:
            selected_components.append(comp)
        else:
            return jsonify({"error": f"El componente con ID '{cid}' no existe en la base de datos."}), 404

    # Run compatibility calculations
    print(f"[COMPATIBILITY CALCULATION] Checking selection: {ids}")
    result = check_all_compatibility(selected_components)

    # Cache result
    COMPATIBILITY_CACHE[cache_key] = result

    return jsonify(result)

if __name__ == "__main__":
    app.run(port=3000, debug=True)
