import os

from flask import render_template

from backend.repositories.hero_repository import HeroRepository
from backend.models.hero_model import Hero
from PIL import Image
import uuid


class HeroService:
    def __init__(self):
        self.repository = HeroRepository()

        self.image_path = './static/images'
        self.homepage_path = './pages/homepage.html'

    def get_list(self, skip: int = 0, take: int = 100) -> list[Hero]:
        return self.repository.get_list(skip, take)

    def get(self, hero_id: str) -> Hero:
        return self.repository.get(hero_id)

    def create(self, hero: Hero) -> Hero:
        return self.repository.create(hero)

    def update(self, hero: Hero) -> Hero:
        if hero.id is None:
            raise {'status': 'error', 'message': 'No hero id'}

        return self.repository.update(hero.id, hero)

    def delete(self, hero_id: str) -> None:
        self.repository.delete(hero_id)

    def upload_image(self, file) -> str:
        image = Image.open(file)
        image_width, image_height = image.size

        if image_width == image_height:
            new_image = image.resize((142, 142))

        elif image_width > image_height:
            new_image = image.resize((round(image_width / image_height * 142), 142))
            temp_size = (round(image_width / image_height * 142) - 142) / 2
            new_image = new_image.crop((temp_size, 0, temp_size + 142, 142))
        else:
            new_image = image.resize((142, round(image_height / image_width * 142)))
            temp_size = (round(image_height / image_width * 142) - 142) / 2
            new_image = new_image.crop((0, temp_size, 142, temp_size + 142))

        if file.filename == '':
            raise {'status': 'error', 'message': 'No selected file'}

        if image:
            filename = f'{self.image_path}/{str(uuid.uuid4())}.{file.filename.split(".")[-1]}'
            new_image.save(filename)
            return filename

    def delete_image(self, file_path: str) -> dict:
        if file_path is None:
            raise {'status': 'error', 'message': 'No file path'}

        filename = file_path.split('/')[-1]
        if filename == 'placeholder.png':
            raise {'status': 'error', 'message': 'Cannot delete placeholder'}

        try:
            os.remove(f'{self.image_path}/{filename}')
            return {'status': 'ok'}
        except FileNotFoundError:
            raise {'status': 'error', 'message': 'No such file'}

    def get_homepage(self) -> str:
        try:
            with open(self.homepage_path, 'r', encoding='utf-8') as page:
                return page.read()
        except FileNotFoundError:
            self.update_homepage()
            with open(self.homepage_path, 'r', encoding='utf-8') as page:
                return page.read()

    def update_homepage(self) -> bool:
        heroes = self.get_list(take=10000)
        with open(self.homepage_path, 'w', encoding='utf-8') as page:
            page.write(render_template('home.html', data=heroes))
        return True
