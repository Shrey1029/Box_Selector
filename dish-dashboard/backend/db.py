from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from urllib.parse import quote_plus, urlparse, urlunparse

load_dotenv()

cluster_uri = os.getenv("MONGODB_cluster", "")
password = os.getenv("MONGODB_password", "")

if "<db_password>" in cluster_uri:
    MONGO_URI = cluster_uri.replace("<db_password>", quote_plus(password))
else:
    parsed = urlparse(cluster_uri)
    if parsed.username and parsed.password:
        user = quote_plus(parsed.username)
        pwd = quote_plus(parsed.password)
        host = parsed.hostname or ""
        port = f":{parsed.port}" if parsed.port else ""
        netloc = f"{user}:{pwd}@{host}{port}"
        MONGO_URI = urlunparse(parsed._replace(netloc=netloc))
    else:
        MONGO_URI = cluster_uri

client = AsyncIOMotorClient(MONGO_URI)
db = client.dishdb
dishes_collection = db.dishes
print(MONGO_URI)