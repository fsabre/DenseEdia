from datetime import datetime
from typing import Optional

from pony import orm
from pydantic import BaseModel, Field

from denseedia.config import CONFIG, ROOT_PATH

db = orm.Database()


class Edium(db.Entity):
    name = orm.Optional(str)
    kind = orm.Required(str)
    creation_date = orm.Required(datetime, default=datetime.now)

    elements = orm.Set("Element")
    links_out = orm.Set("Link", reverse="start")
    links_in = orm.Set("Link", reverse="end")

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "kind": self.kind,
            "creation_date": self.creation_date.isoformat(),
        }

    class PostModel(BaseModel):
        name: str = Field(default="")
        kind: str = Field(min_length=1)
        creation_date: datetime = Field(default_factory=datetime.now)

    class PatchModel(BaseModel):
        name: Optional[str] = Field()
        kind: Optional[str] = Field(min_length=1)
        creation_date: Optional[datetime] = Field()


class Element(db.Entity):
    name = orm.Required(str)
    kind = orm.Discriminator(int)
    _discriminator_ = 0
    edium = orm.Required(Edium)
    creation_date = orm.Required(datetime, default=datetime.now)

    def to_json(self):
        return {
            "id": self.id,
            "kind": self._discriminator_,
            "name": self.name,
            "value": self.value,
            "creation_date": self.creation_date.isoformat(),
        }

    @property
    def value(self):
        return None

    class PostModel(BaseModel):
        name: str = Field()
        edium: int = Field(ge=1)
        creation_date: datetime = Field(default_factory=datetime.now)

    class PatchModel(BaseModel):
        name: Optional[str] = Field()
        creation_date: Optional[datetime] = Field()


class BoolElement(Element):
    _discriminator_ = 1
    bool_value = orm.Required(bool)

    @property
    def value(self):
        return self.bool_value

    @value.setter
    def value(self, value):
        self.bool_value = value

    class PostModel(Element.PostModel):
        bool_value: bool = Field()

    class PatchModel(Element.PatchModel):
        bool_value: Optional[bool] = Field()


class IntElement(Element):
    _discriminator_ = 3
    int_value = orm.Required(int)

    def to_json(self):
        dct = super().to_json()
        dct["value"] = self.int_value
        return dct

    @property
    def value(self):
        return self.int_value

    @value.setter
    def value(self, value):
        self.int_value = value

    class PostModel(Element.PostModel):
        int_value: int = Field()

    class PatchModel(Element.PatchModel):
        int_value: Optional[int] = Field()


class FloatElement(Element):
    _discriminator_ = 4
    float_value = orm.Required(float)

    def to_json(self):
        dct = super().to_json()
        dct["value"] = self.float_value
        return dct

    @property
    def value(self):
        return self.float_value

    @value.setter
    def value(self, value):
        self.float_value = value

    class PostModel(Element.PostModel):
        float_value: float = Field()

    class PatchModel(Element.PatchModel):
        float_value: Optional[float] = Field()


class StrElement(Element):
    _discriminator_ = 5
    str_value = orm.Required(str)

    def to_json(self):
        dct = super().to_json()
        dct["value"] = self.str_value
        return dct

    @property
    def value(self):
        return self.str_value

    @value.setter
    def value(self, value):
        self.str_value = value

    class PostModel(Element.PostModel):
        str_value: str = Field()

    class PatchModel(Element.PatchModel):
        str_value: Optional[str] = Field()


class DatetimeElement(Element):
    _discriminator_ = 6
    datetime_value = orm.Required(datetime)

    def to_json(self):
        dct = super().to_json()
        dct["value"] = self.datetime_value.isoformat()
        return dct

    @property
    def value(self):
        return self.datetime_value

    @value.setter
    def value(self, value):
        self.datetime_value = value

    class PostModel(Element.PostModel):
        datetime_value: datetime = Field()

    class PatchModel(Element.PatchModel):
        datetime_value: Optional[datetime] = Field()


class Link(db.Entity):
    start = orm.Required(Edium)
    end = orm.Required(Edium)
    has_direction = orm.Required(bool)
    label = orm.Optional(str)
    creation_date = orm.Required(datetime, default=datetime.now)

    def to_json(self):
        return {
            "id": self.id,
            "start": self.start.id,
            "end": self.end.id,
            "has_direction": self.has_direction,
            "label": self.label,
            "creation_date": self.creation_date.isoformat(),
        }

    class PostModel(BaseModel):
        start: int = Field(ge=1)
        end: int = Field(ge=1)
        has_direction: bool = Field()
        label: str = Field(default="")
        creation_date: datetime = Field(default_factory=datetime.now)

    class PatchModel(BaseModel):
        label: Optional[str] = Field()
        creation_date: Optional[datetime] = Field()


db_config = CONFIG["db"]
rel_filename = db_config.pop("filename")
db.bind(**db_config, filename=str(ROOT_PATH.joinpath(rel_filename).absolute()))
db.generate_mapping(create_tables=True)
