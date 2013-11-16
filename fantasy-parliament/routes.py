# coding=utf-8

from users import get_user, upsert_user
from data import getData
from flask import Flask, request, render_template
from bson.json_util import dumps

application = Flask(__name__)

@application.route('/')
def home():
    return render_template('index.html')

@application.route('/test')
def test():
    return getData()

@application.route('/user/<email>', methods=['GET', 'PUT'])
def user(email):
    if request.method == 'PUT':
        return dumps(upsert_user(email, request.json))
    else:
        return dumps(get_user(email))
