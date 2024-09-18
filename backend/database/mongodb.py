import os

from pymongo import MongoClient

client = MongoClient(os.getenv("MONGO_URL", 'mongodb://root:rCHAsTicatIE@localhost:27017/'))
db = client.get_database("db")


