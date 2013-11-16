# coding=utf-8

from users import get_user, upsert_user
from data import getData
from flask import Flask, render_template

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
        mps = ['bob', 'alice'] # TODO get this from request body
        return upsert_user(email, mps)
    else:
        return get_user(email)
