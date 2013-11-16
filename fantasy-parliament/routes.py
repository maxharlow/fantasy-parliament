# coding=utf-8

from users import get_user, upsert_user, get_users
from data import getData
from flask import Flask, request, render_template
from bson.json_util import dumps

application = Flask(__name__)

@application.route('/')
def home():
    return render_template('index.html')

@application.route('/leaderboard')
def leaderboard():
    return render_template('leaderboard.html', users=get_users())

@application.route('/test')
def test():
    return getData()

@application.route('/user/<email>', methods=['GET', 'PUT'])
def user(email):
    if request.method == 'PUT':
        return if dumps(upsert_user(email, request.json))
    else:
        user = get_user(email) or {}
        return dumps(user)
