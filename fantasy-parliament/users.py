# coding=utf-8

from pymongo import MongoClient

def db():
    client = MongoClient('dharma.mongohq.com', 10018)
    db = client['fantasy-parliament']
    db.authenticate('fp', 'rewired')
    return db

def upsert_user(email, user):
    return db().users.update({"email": email}, user, upsert = True)

def get_user(email):
    return db().users.find_one({"email": email})

def get_users():
    return db().users.find()
