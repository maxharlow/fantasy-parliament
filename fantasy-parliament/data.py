# coding=utf-8

import requests

def getData():
    r = requests.get('http://api.gu.com/search')
    return str(r.json())

