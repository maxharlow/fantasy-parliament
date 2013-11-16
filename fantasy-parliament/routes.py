# coding=utf-8

from flask import Flask
from data import getData

application = Flask(__name__, static_folder='../web')

@application.route('/')
def test():
    return getData()
    
