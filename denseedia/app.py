"""Create the Flask app"""

from flask import Flask, Request, abort, jsonify, make_response

from denseedia.config import CONFIG
from denseedia.routes import register_routes

app = Flask(__name__)


@app.errorhandler(404)
def on_route_not_found(error):
    """Override the HTML 404 default."""
    content = {"msg": "Page not found"}
    return jsonify(content), 404


@app.errorhandler(405)
def on_method_not_allowed(error):
    """Override the HTML 405 default."""
    content = {"msg": "Method not allowed"}
    return jsonify(content), 405


def on_json_loading_failed(req, error):
    """Abort with a custom JSON message."""
    content = {"msg": "JSON not valid", "error": error.args[0]}
    abort(make_response(jsonify(content), 400))


Request.on_json_loading_failed = on_json_loading_failed


@app.after_request
def fix_cors(response):
    """Allow the React App to access the API."""
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:59131"
    return response


register_routes(app)


def run_server():
    flask_config = CONFIG["flask"]
    app.run(debug=flask_config["debug"], port=flask_config["port"])
