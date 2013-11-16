# coding=utf-8

from flask import Flask, render_template

application = Flask(__name__)

@application.route('/')
def test():
    return render_template('index.html')
