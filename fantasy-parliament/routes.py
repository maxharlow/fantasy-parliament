# coding=utf-8

from flask import Flask

application = Flask(__name__, static_folder='../web')

@application.route('/')
def test():
    return 'hello'
    
