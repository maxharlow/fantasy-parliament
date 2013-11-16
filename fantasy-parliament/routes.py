# coding=utf-8

<<<<<<< HEAD
from flask import Flask, request
from users import get_user, upsert_user
=======
from flask import Flask
from data import getData
from flask import Flask, render_template
>>>>>>> 95f84b085f56cca82d7776fa0ef03764e1dac8fd

application = Flask(__name__)

@application.route('/')
def home():
    return render_template('index.html')

@application.route('/test')
def test():
<<<<<<< HEAD
    return 'hello'

@application.route('/user/<email>', methods=['GET', 'PUT'])
def user(email):
    if request.method == 'PUT':
        mps = ['bob', 'alice'] # TODO get this from request body
        return upsert_user(email, mps)
    else:
        return get_user(email)
=======
    return getData()
>>>>>>> 95f84b085f56cca82d7776fa0ef03764e1dac8fd
