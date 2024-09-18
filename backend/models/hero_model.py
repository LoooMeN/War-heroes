from typing import Annotated

from bson import ObjectId
from pydantic import BaseModel, Field, field_validator, BeforeValidator, ConfigDict


def id_factory():
    return str(ObjectId())


class Hero(BaseModel):
    id: str = Field(default_factory=id_factory, alias='_id')

    image: str | None = Field(default=None)
    name: str | None = Field(default=None)
    region: str | None = Field(default=None)
    gender: str | None = Field(default=None)
    position: str | None = Field(default=None)

    url: str | None = Field(default=None)

    death_date: str | None = Field(default=None)
    date_added: str | None = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
    )
