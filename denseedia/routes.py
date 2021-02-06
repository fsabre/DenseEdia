"""Generate and register the routes"""

import pydantic
from flask import jsonify, render_template, request, url_for
from pony import orm

from denseedia.storage import (
    BoolElement,
    DatetimeElement,
    Edium,
    Element,
    FloatElement,
    IntElement,
    Link,
    StrElement,
)


def get_all_for(entity_class):
    def get_all_entities():
        content = []
        with orm.db_session:
            for entity in entity_class.select():
                content.append(entity.to_json())
        return jsonify(content)

    return get_all_entities


def get_one_for(entity_class):
    def get_one_entity(entity_id):
        try:
            with orm.db_session:
                content = entity_class[entity_id].to_json()
            return jsonify(content)
        except orm.ObjectNotFound:
            return jsonify({"msg": "Non existant ID"}), 404

    return get_one_entity


def post_for(entity_class, location_func_name):
    def add_one_entity():
        body = request.get_json(force=True)
        try:
            sanitized = entity_class.PostModel(**body)
            with orm.db_session:
                entity = entity_class(**sanitized.dict())
                orm.commit()
                content = entity.to_json()
            return (
                jsonify(content),
                201,
                {"Location": url_for(location_func_name, entity_id=entity.id)},
            )
        except pydantic.ValidationError as err:
            content = {"msg": "Data not valid"}
            return jsonify(content), 400
        except orm.TransactionIntegrityError as err:
            if "FOREIGN KEY constraint failed" in err.args[0]:
                content = {"msg": "Some of the provided IDs are non-existant"}
                return jsonify(content), 400
            else:
                raise

    return add_one_entity


def patch_for(entity_class):
    def modify_entity(entity_id):
        body = request.get_json(force=True)
        try:
            sanitized = entity_class.PatchModel(**body)
            trimmed = {k: v for k, v in sanitized if k in body}
            with orm.db_session:
                entity = entity_class[entity_id]
                for key, value in trimmed.items():
                    setattr(entity, key, value)
                orm.commit()
                content = entity.to_json()
            return jsonify(content), 200
        except orm.ObjectNotFound as err:
            return jsonify({"msg": "Non existant ID"}), 404
        except (pydantic.ValidationError, ValueError) as err:
            content = {"msg": "Data not valid"}
            return jsonify(content), 400
        except orm.TransactionIntegrityError as err:
            if "FOREIGN KEY constraint failed" in err.args[0]:
                content = {"msg": "Some of the provided IDs are non-existant"}
                return jsonify(content), 400
            else:
                raise

    return modify_entity


def delete_for(entity_class):
    def delete_one_entity(entity_id):
        try:
            with orm.db_session:
                entity_class[entity_id].delete()
            return "", 204
        except orm.ObjectNotFound:
            return jsonify({"msg": "Non existant ID"}), 404

    return delete_one_entity


def register_routes(app):
    # EDIA ROUTES
    app.add_url_rule(
        rule="/edia",
        methods=["GET"],
        endpoint="get_all_edia",
        view_func=get_all_for(Edium),
    )
    app.add_url_rule(
        rule="/edia/<int:entity_id>",
        methods=["GET"],
        endpoint="get_one_edium",
        view_func=get_one_for(Edium),
    )
    app.add_url_rule(
        rule="/edia",
        methods=["POST"],
        endpoint="post_edium",
        view_func=post_for(Edium, "get_one_edium"),
    )
    app.add_url_rule(
        rule="/edia/<int:entity_id>",
        methods=["PATCH"],
        endpoint="patch_edium",
        view_func=patch_for(Edium),
    )
    app.add_url_rule(
        rule="/edia/<int:entity_id>",
        methods=["DELETE"],
        endpoint="delete_edium",
        view_func=delete_for(Edium),
    )

    @app.route("/edia/<int:entity_id>/elements", methods=["GET"])
    def get_edium_elements(entity_id):
        content = []
        try:
            with orm.db_session:
                edium = Edium[entity_id]
                for element in edium.elements:
                    content.append(element.to_json())
            return jsonify(content)
        except orm.ObjectNotFound:
            return jsonify({"msg": "Non existant ID"}), 404

    # ELEMENTS ROUTES
    app.add_url_rule(
        rule="/elements",
        methods=["GET"],
        endpoint="get_all_elements",
        view_func=get_all_for(Element),
    )
    app.add_url_rule(
        rule="/elements/<int:entity_id>",
        methods=["GET"],
        endpoint="get_one_element",
        view_func=get_one_for(Element),
    )
    app.add_url_rule(
        rule="/elements/none",
        methods=["POST"],
        endpoint="post_element_none",
        view_func=post_for(Element, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/bool",
        methods=["POST"],
        endpoint="post_element_bool",
        view_func=post_for(BoolElement, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/int",
        methods=["POST"],
        endpoint="post_element_int",
        view_func=post_for(IntElement, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/float",
        methods=["POST"],
        endpoint="post_element_float",
        view_func=post_for(FloatElement, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/str",
        methods=["POST"],
        endpoint="post_element_str",
        view_func=post_for(StrElement, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/datetime",
        methods=["POST"],
        endpoint="post_element_datetime",
        view_func=post_for(DatetimeElement, "get_one_element"),
    )
    app.add_url_rule(
        rule="/elements/<int:entity_id>",
        methods=["DELETE"],
        endpoint="delete_element",
        view_func=delete_for(Element),
    )

    # LINKS ROUTES
    app.add_url_rule(
        rule="/links",
        methods=["GET"],
        endpoint="get_all_links",
        view_func=get_all_for(Link),
    )
    app.add_url_rule(
        rule="/links/<int:entity_id>",
        methods=["GET"],
        endpoint="get_one_link",
        view_func=get_one_for(Link),
    )
    app.add_url_rule(
        rule="/links",
        methods=["POST"],
        endpoint="post_link",
        view_func=post_for(Link, "get_one_link"),
    )
    app.add_url_rule(
        rule="/links/<int:entity_id>",
        methods=["DELETE"],
        endpoint="delete_link",
        view_func=delete_for(Link),
    )

    @app.route("/")
    def main():
        return render_template("Main.html")
