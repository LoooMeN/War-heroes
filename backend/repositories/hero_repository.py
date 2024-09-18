from pymongo import DESCENDING

from backend.database.mongodb import db
from backend.models.hero_model import Hero


class HeroRepository:
    def __init__(self):
        self.collection = db.get_collection("heroes")

    def get_list(self, skip: int = None, take: int = None) -> list[Hero]:
        heroes = self.collection.find().sort("_id", DESCENDING)

        if skip is not None:
            heroes = heroes.skip(skip)
        if take is not None:
            heroes = heroes.limit(take)

        return [Hero(**hero) for hero in heroes]

    def get(self, hero_id: str) -> Hero:
        hero = self.collection.find_one({"_id": hero_id})
        if hero is None:
            raise ValueError('No hero')

        return Hero(**hero)

    def create(self, hero: Hero) -> Hero:
        hero_id = self.collection.insert_one(hero.model_dump(by_alias=True)).inserted_id

        hero = self.collection.find_one({"_id": hero_id})
        return Hero(**hero)

    def update(self, hero_id: str, hero: Hero) -> Hero:
        self.collection.update_one({"_id": hero_id}, {"$set": hero.model_dump(by_alias=True)})

        hero = self.collection.find_one({"_id": hero_id})
        return Hero(**hero)

    def delete(self, id: str) -> None:
        self.collection.delete_one({"_id": id})
