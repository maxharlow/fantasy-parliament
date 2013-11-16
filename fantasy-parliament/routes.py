# coding=utf-8

from score import calculate_score
from users import get_user, upsert_user, get_users
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

@application.route('/calculate')
def calculate():
    for user in get_users():
        calculate_score(user)
    return ''
        
@application.route('/user/<email>/scoring')
def user_scoring(email):
	return dumps(get_user(email)['score_breakdown'])
