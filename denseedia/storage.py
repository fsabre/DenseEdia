from datetime import datetime

from pony import orm

from denseedia.config import CONFIG

db = orm.Database()


class Edium(db.Entity):
    name = orm.Optional(str)
    kind = orm.Required(str)
    creation_date = orm.Required(datetime, default=datetime.now)

    elements = orm.Set("Element")
    links_out = orm.Set("Link", reverse="start")
    links_in = orm.Set("Link", reverse="end")


class Element(db.Entity):
    name = orm.Required(str)
    value = orm.Required(str)
    edium = orm.Required(Edium)
    creation_date = orm.Required(datetime, default=datetime.now)


class Link(db.Entity):
    start = orm.Required(Edium)
    end = orm.Required(Edium)
    has_direction = orm.Required(bool)
    label = orm.Optional(str)
    creation_date = orm.Required(datetime, default=datetime.now)


db.bind(**CONFIG["db"])
db.generate_mapping(create_tables=True)
