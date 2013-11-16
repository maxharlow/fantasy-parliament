# coding=utf-8

from pymongo import MongoClient

def db():
    client = MongoClient('dharma.mongohq.com', 10018)
    db = client['fantasy-parliament']
    db.authenticate('fp', 'rewired')
    return db

def upsert_user(user):
    print str(user)
    return db().users.insert(user)

def get_user(email):
    return db().users.find_one({"email": email})
