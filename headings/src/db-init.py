#!/usr/bin/env python

from pymongo import MongoClient
import pymongo
from pprint import pprint
import logging
import os
import json
import datetime
import time

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# stuff
os.system("netstat -n -a | grep LISTEN")
os.system("ifconfig")


# open database connection
logging.info("attempting to connect to database ...")
username="root"
password="mongo"
client = MongoClient('mongodb://%s:%s@mongo' % (username, password))
logger.info(client)
db = client.headings
logger.info(db.command("dbstats"))

# if no sources, init from data file
if not db.sources.find_one():
    for path in [".", "../data"]:
        fname = path + "/sources.json"
        if os.path.isfile(fname):
            logger.info("loading sources from:" + fname)
            with open(fname) as f:
                data = json.load(f)
                db.sources.insert_many(data)
            break

# verify that has sources
if not db.sources.find_one():
    logger.error("failed to load sources!")
logger.info("number of sources: %d" % db.command("collstats", "sources")["count"])

# set up indexes
db.headings.create_index([('title', pymongo.TEXT)], name='search_index', default_language='english')

def waitForNextHour():
    nexthour = datetime.datetime.replace(datetime.datetime.now() + datetime.timedelta(hours=1),minute=0, second=0)
    delta = nexthour - datetime.datetime.now()
    logger.info("will wait for %d seconds" % delta.seconds)
    time.sleep(delta.seconds)


# split to run both rss fetcher and bot itself
pid = os.fork()
if pid > 0:
    logger.info("This is written by the parent process {}".format(os.getpid()))
    while True:
        logger.info("invoking reader")
        os.system("python ./rss-headings.py")
        logger.info("waiting for next hour")
        waitForNextHour()
else:
    logger.info("This is written by the child process {}".format(os.getpid()))
    while True:
        logger.info("invoking bot")
        os.system("python ./telegram-quiz.py")
        time.sleep(30)







