from flask import Flask, jsonify

from denseedia.storage import Edium, Element, Link, orm

app = Flask(__name__)


def generate_get_routes(entity_class, url_base, sing_name, plural_name):
    def get_entities():
        content = []
        with orm.db_session:
            for entity in entity_class.select():
                content.append(entity.to_json())
        return jsonify(content)

    app.add_url_rule(
        rule=url_base,
        endpoint=f"get_{plural_name}",
        view_func=get_entities,
        methods=["GET"],
    )

    def get_one_entity(entity_id):
        try:
            with orm.db_session:
                content = entity_class[entity_id].to_json()
            return jsonify(content)
        except orm.ObjectNotFound:
            return jsonify({"error": "Non existant ID"}), 404

    app.add_url_rule(
        rule=url_base + "/<int:entity_id>",
        endpoint=f"get_one_{sing_name}",
        view_func=get_one_entity,
        methods=["GET"],
    )


generate_get_routes(Edium, "/edia", "edium", "edia")
generate_get_routes(Element, "/elements", "element", "elements")
generate_get_routes(Link, "/links", "link", "links")


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
