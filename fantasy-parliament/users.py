from pymongo import MongoClient

def db():
    return MongoClient().fantasy_parliament.users

def upsert_user(email, user):
    return db().update({"email": email}, user, upsert = True)

def get_user(email):
    return db().find_one({"email": email})
