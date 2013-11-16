from pymongo import MongoClient

def db():
    return MongoClient().fantasy_parliament.users

def upsert_user(user):
    return db().insert(user)

def get_user(email):
    return db().find_one({"email": email})
