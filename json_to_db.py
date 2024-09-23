import json
from backend.models.hero_model import Hero
from backend.services.hero_service import HeroService


def migration():
    with open('static/heroes.json', 'r') as file:
        json_data = json.loads(file.read())

    service = HeroService()
    service.repository.collection.drop()

    for json_hero in json_data['heroes'].reverse():
        hero = Hero(**json_hero)
        service.create(hero)

    print('Migration completed!')
    for hero in service.get_list():
        print(hero.model_dump())


if __name__ == '__main__':
    migration()
