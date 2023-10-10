import json
import os
import uuid

from PIL import Image
from flask import Flask, send_from_directory, render_template, request, redirect, make_response

app = Flask(__name__)

SECRET_TOKEN = 'e0380cca-93ba-409d-9d3e-d38287964a94'


@app.route('/admin_for_lesia')
def adminhome():
    if request.cookies.get('admin') == SECRET_TOKEN:
        return render_template('admin.html')
    else:
        return redirect('/login')


@app.route('/getjson')
def getjson():
    return send_from_directory('static', "heroes.json")


@app.route('/setjson', methods=["POST"])
def setjson():
    data = json.loads(request.data)
    with open('./static/heroes.json', 'w') as file:
        file.write(json.dumps(data, indent=2))

    with open('./pages/homepage.html', 'w') as page:
        page.write(render_template('home.html', data=data['heroes']))
    return {'status': 'ok'}


@app.route('/')
def home():
    with open('./static/heroes.json', 'r') as file:
        return render_template('home.html', data=json.loads(file.read())['heroes'])
    # check if file exists
    # try:
    #     with open('./pages/homepage.html', 'r') as page:
    #         return page.read()
    # except FileNotFoundError:
    #     return "Page not found!"


@app.route('/Images', methods=['POST'])
def upload_file():
    if 'newImage' not in request.files:
        return 'No file part'

    file = request.files['newImage']

    image = Image.open(file)
    image_width = image.size[0]
    image_height = image.size[1]

    if image_width == image_height:
        new_image = image.resize((142, 142))
    elif image_width > image_height:
        new_image = image.resize((round(image_width / image_height * 142), 142))
        # обрезать ширину
        temp_size = (round(image_width / image_height * 142) - 142) / 2
        new_image = new_image.crop((temp_size, 0, temp_size + 142, 142))
    else:
        new_image = image.resize((142, round(image_height / image_width * 142)))
        # обрезать высоту
        temp_size = (round(image_height / image_width * 142) - 142) / 2
        new_image = new_image.crop((0, temp_size, 142, temp_size + 142))

    if file.filename == '':
        return False

    if image:
        # use uuid4 to generate a random string and get the file extension
        filename = f'./static/photos/{str(uuid.uuid4())}.{file.filename.split(".")[-1]}'
        new_image.save(filename)
        return filename


@app.route('/Images', methods=['DELETE'])
def delete_file():
    file_path = request.args.get('filePath')
    if file_path is None:
        return {'status': 'error', 'message': 'No file path'}

    filename = file_path.split('/')[-1]
    if filename == 'placeholder.png':
        return {'status': 'error', 'message': 'File not found'}

    try:
        os.remove(f'./static/photos/{filename}')
        return {'status': 'ok'}
    except FileNotFoundError:
        return {'status': 'error', 'message': 'File not found'}


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        if request.form['username'] == 'Lesya' and request.form['password'] == 'Admin123':
            # set Admin cookie
            # return redirect to /admin_for_lesia

            # write token in next line

            token = ''

            resp = make_response(redirect('/admin_for_lesia'))
            resp.set_cookie('admin', SECRET_TOKEN, max_age=60 * 60 * 24 * 365)  # 1 year
            return resp
        else:
            return render_template('login.html', error='Wrong username or password')
    return render_template('login.html')


if __name__ == '__main__':
    app.run()
