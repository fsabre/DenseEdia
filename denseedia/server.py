from flask import Flask, jsonify

from denseedia.storage import Edium, orm

app = Flask(__name__)


@app.route("/edia", methods=["GET"])
def get_edia():
    content = []
    with orm.db_session:
        for edium in Edium.select():
            content.append(edium.to_json())
    return jsonify(content)


@app.route("/edia/<int:edium_id>", methods=["GET"])
def get_one_edium(edium_id):
    try:
        with orm.db_session:
            content = Edium[edium_id].to_json()
        return jsonify(content)
    except orm.ObjectNotFound:
        return jsonify({"error": "Non existant ID"}), 404


@app.route("/edia/<int:edium_id>/elements", methods=["GET"])
def get_edium_elements(edium_id):
    content = []
    try:
        with orm.db_session:
            edium = Edium[edium_id]
            for element in edium.elements:
                content.append(element.to_json())
        return jsonify(content)
    except orm.ObjectNotFound:
        return jsonify({"error": "Non existant ID"}), 404


def run_server():
    app.run(debug=True)
