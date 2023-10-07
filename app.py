import json

from flask import Flask, send_from_directory, render_template, url_for, request
import os

app = Flask(__name__)


@app.route('/admin_for_lesia')
def adminhome():
    return render_template('admin.html')

@app.route('/getjson')
def getjson():
    return send_from_directory('static', "heroes.json")

@app.route('/setjson', methods=["POST"])
def setjson():
    data = json.loads(request.data)
    with open('./static/heroes.json', 'w') as file:
        file.write(json.dumps(data, indent=2))
    return "none"

@app.route('/')
def home():
    with open('./static/heroes.json', 'r') as file:
        return render_template('home.html', data=json.loads(file.read()))

@app.route('/uploadImage', methods=['POST'])
def upload_file():
    if 'newImage' not in request.files:
        return 'No file part'

    file = request.files['newImage']

    if file.filename == '':
        return False

    if file:
        filename = f'./static/photos/{file.filename}'
        file.save(filename)
        return filename

if __name__ == '__main__':
    app.run()
