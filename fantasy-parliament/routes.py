# coding=utf-8

from flask import Flask, request
from users import get_user, upsert_user

application = Flask(__name__, static_folder='../web')

@application.route('/')
def test():
    return 'hello'

@application.route('/user/<email>', methods=['GET', 'PUT'])
def user(email):
    if request.method == 'PUT':
        mps = ['bob', 'alice'] # TODO get this from request body
        return upsert_user(email, mps)
    else:
        return get_user(email)
