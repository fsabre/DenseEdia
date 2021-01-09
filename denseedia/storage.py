import enum
from datetime import datetime
from typing import Optional

from pony import orm
from pydantic import BaseModel, Field, root_validator

from denseedia.config import CONFIG

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


class ElementType(enum.IntEnum):
    NONE = 0
    BOOL = 1
    INT = 2
    FLOAT = 3
    STR = 4
    DATETIME = 5

    @classmethod
    def from_var(cls, var):
        if var is None:
            return cls.NONE
        elif isinstance(var, bool):
            return cls.BOOL
        elif isinstance(var, int):
            return cls.INT
        elif isinstance(var, float):
            return cls.FLOAT
        elif isinstance(var, str):
            return cls.STR
        elif isinstance(var, datetime):
            return cls.DATETIME
        else:
            raise ValueError()

    @property
    def attr_name(self):
        if self is self.NONE:
            raise ValueError()
        return [
            "bool_value",
            "int_value",
            "float_value",
            "str_value",
            "datetime_value",
        ][self.value - 1]


class Element(db.Entity):
    name = orm.Required(str)
    kind = orm.Required(int, min=0)
    bool_value = orm.Optional(bool)
    int_value = orm.Optional(int)
    float_value = orm.Optional(float)
    str_value = orm.Optional(str)
    datetime_value = orm.Optional(datetime)
    edium = orm.Required(Edium)
    creation_date = orm.Required(datetime, default=datetime.now)

    def __init__(self, name, value, edium, creation_date):
        super().__init__(
            name=name,
            kind=ElementType.NONE,
            bool_value=None,
            int_value=None,
            float_value=None,
            str_value="",
            datetime_value=None,
            edium=edium,
            creation_date=creation_date,
        )
        self.value = value

    def _clear_value_fields(self):
        self.bool_value = None
        self.int_value = None
        self.float_value = None
        self.str_value = ""
        self.datetime_value = None

    @property
    def value(self):
        if self.kind == ElementType.NONE:
            return None
        else:
            return getattr(self, ElementType(self.kind).attr_name)

    @value.setter
    def value(self, value):
        new_kind = ElementType.from_var(value)
        if self.kind != new_kind:
            self._clear_value_fields()
            self.kind = new_kind

        if self.kind == ElementType.NONE:
            pass
        else:
            setattr(self, ElementType(self.kind).attr_name, value)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "value": self.value.isoformat()
            if self.kind == ElementType.DATETIME
            else self.value,
            "creation_date": self.creation_date.isoformat(),
        }

    class PostModel(BaseModel):
        name: str = Field(min_length=1)
        kind: ElementType = Field()
        bool_value: Optional[bool] = Field()
        int_value: Optional[int] = Field()
        float_value: Optional[float] = Field()
        str_value: Optional[str] = Field()
        datetime_value: Optional[datetime] = Field()
        edium: int = Field(ge=1)
        creation_date: datetime = Field(default_factory=datetime.now)

        @root_validator(pre=True)
        def dispatch_the_value(cls, values):
            try:
                kind = values["kind"]
                if kind != ElementType.NONE:
                    values[ElementType(kind).attr_name] = values["value"]
                return values
            except KeyError:
                raise ValueError()

        def dict(self, *args, **kwargs):
            dct = super().dict(*args, **kwargs)
            for possible_kind in ElementType:
                if possible_kind is not ElementType.NONE:
                    dct.pop(possible_kind.attr_name)
            if self.kind != ElementType.NONE:
                dct["value"] = getattr(self, ElementType(self.kind).attr_name)
            dct.pop("kind")
            return dct


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
            "creation_date": self.creation_date.isoformat(),
        }

    class PostModel(BaseModel):
        start: int = Field(ge=1)
        end: int = Field(ge=1)
        has_direction: bool = Field()
        label: str = Field(default="")
        creation_date: datetime = Field(default_factory=datetime.now)


db.bind(**CONFIG["db"])
db.generate_mapping(create_tables=True)
