import pydantic
from flask import Flask, jsonify, request, url_for

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
            return jsonify({"msg": "Non existant ID"}), 404

    app.add_url_rule(
        rule=url_base + "/<int:entity_id>",
        endpoint=f"get_one_{sing_name}",
        view_func=get_one_entity,
        methods=["GET"],
    )


def generate_delete_route(entity_class, url_base, sing_name):
    def delete_one_entity(entity_id):
        try:
            with orm.db_session:
                entity_class[entity_id].delete()
            return "", 204
        except orm.ObjectNotFound:
            return jsonify({"msg": "Non existant ID"}), 404

    app.add_url_rule(
        rule=url_base + "/<int:entity_id>",
        endpoint=f"delete_one_{sing_name}",
        view_func=delete_one_entity,
        methods=["DELETE"],
    )


# EDIA ROUTES

generate_get_routes(Edium, "/edia", "edium", "edia")


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
        return jsonify({"msg": "Non existant ID"}), 404


@app.route("/edia", methods=["POST"])
def add_edium():
    body = request.get_json(force=True)
    try:
        sanitized = Edium.PostModel(**body)
        with orm.db_session:
            edium = Edium(**sanitized.dict())
            orm.commit()
            content = edium.to_json()
        return (
            jsonify(content),
            201,
            {"Location": url_for("get_one_edium", entity_id=edium.id)},
        )
    except pydantic.ValidationError as err:
        return (
            jsonify({"msg": "Data not valid", "errors": err.errors()}),
            400,
        )


generate_delete_route(Edium, "/edia", "edium")

# ELEMENTS ROUTES

generate_get_routes(Element, "/elements", "element", "elements")
generate_delete_route(Element, "/elements", "element")

# LINKS ROUTES

generate_get_routes(Link, "/links", "link", "links")
generate_delete_route(Link, "/links", "link")


def run_server():
    app.run(debug=True)
