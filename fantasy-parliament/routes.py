# coding=utf-8

from users import get_user, upsert_user
from flask import Flask, request, render_template
from bson.json_util import dumps

application = Flask(__name__)

@application.route('/')
def home():
    return render_template('index.html')

@application.route('/leaderboard')
def leaderboard():
    users = get_users().sort('score', -1)
    return render_template('leaderboard.html', users=users)

@application.route('/user/<email>', methods=['GET', 'PUT'])
def user(email):
    if request.method == 'PUT':
        return dumps(upsert_user(email, request.json))
    else:
        user = get_user(email) or {}
        return dumps(user)
