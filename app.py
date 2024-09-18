import json
import os
import uuid
from crypt import methods

from PIL import Image
from waitress import serve
from flask import Flask, send_from_directory, render_template, request, redirect, make_response, url_for
from flask_cors import CORS, cross_origin

from backend.models.hero_model import Hero
from backend.services.hero_service import HeroService
from backend.services.login_service import LoginService

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

SECRET_TOKEN = 'e0380cca-93ba-409d-9d3e-d38287964a94'


@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'images/favicon.png')


@app.route('/')
def home(service=HeroService()):
    return service.get_homepage()


@app.route('/login', methods=['GET', 'POST'])
def login(service=LoginService()):
    if request.method == 'POST':
        if service.validate_credentials(request.form['username'], request.form['password']):
            resp = make_response(redirect(url_for('admin_home')))
            return service.login(resp)
        else:
            return render_template('login.html', error='Wrong username or password')
    return render_template('login.html')


@app.route('/admin_panel')
def admin_home():
    if request.cookies.get('admin') == SECRET_TOKEN:
        return render_template('admin.html')
    else:
        return redirect(url_for('login'))


@cross_origin(origins='*')
@app.route('/heroes')
def heroes(service=HeroService()):
    if request.cookies.get('admin') != SECRET_TOKEN:
        return {'status': 'error', 'message': 'You are not an admin'}

    if request.method == 'GET':
        return [hero.model_dump() for hero in service.get_list()]

    if request.method == 'POST':
        hero = service.create(
                Hero(**request.json)
        )
        service.update_homepage()
        return hero.model_dump()

    if request.method == 'PUT':
        hero = service.update(
                Hero(**request.json)
        )
        service.update_homepage()
        return hero.model_dump()


@app.route('/heroes/<id>', methods=['GET', 'DELETE'])
def heroes_with_id(id: str, service=HeroService()):
    if request.cookies.get('admin') != SECRET_TOKEN:
        return {'status': 'error', 'message': 'You are not an admin'}

    if request.method == 'GET':
        return service.get(id).model_dump()

    if request.method == 'DELETE':
        return service.delete(request.args.get('id'))


@app.route('/Images', methods=['POST', 'DELETE'])
def upload_file(service=HeroService()):
    if request.cookies.get('admin') != SECRET_TOKEN:
        return {'status': 'error', 'message': 'You are not an admin'}

    if request.method == 'POST':
        if 'newImage' not in request.files:
            return 'No file part'

        return service.upload_image(
                request.files['newImage']
        )

    if request.method == 'DELETE':
        return service.delete_image(
                request.args.get('filePath')
        )
