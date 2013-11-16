# coding=utf-8

from flask import Flask
from data import getData
from flask import Flask, render_template

application = Flask(__name__)

@application.route('/')
def home():
    return render_template('index.html')

@application.route('/test')
def test():
    return getData()
