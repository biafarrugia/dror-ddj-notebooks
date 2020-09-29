#!/usr/bin/env python
# coding: utf-8

from pymongo import MongoClient
import feedparser
from pprint import pprint
import datetime
import random

def get_db():

    # open database connection
    username="root"
    password="mongo"
    client = MongoClient('mongodb://%s:%s@mongo' % (username, password))
    db = client.headings
    return db

def build_heading_quiz(answers, keyword=None, sources_subset=None):

    db = get_db()
    
    # loop for 10 attempts
    midnight = datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time())
    sources_all = [x["name"] for x in db.sources.find()]
    domain = os.environ["TEL_BOT_DOMAIN"]

    # subset sources?
    if sources_subset:
        sources_all = [ sources_all[i-1] for i in sources_subset]
    logger.info("sources_all: " + str(sources_all))

    logger.info("build_heading_quiz: %s" % domain)
    for _ in range(10):
    
        # pick random sources
        sources = random.sample(sources_all, answers)
        random.shuffle(sources)
        
        # get heading for one of the sources
        heading_source_name = None
        for s in sources:
            query_fields =  {
                "$and": [
                    {
                        "_timestamp": 
                        {
                            "$gte": midnight
                        }
                    }, 
                    {
                        "_source.name": s
                    },
                    {
                        "_source.domain": domain
                    }
                ]
            }
            if keyword:
                query_fields["$text"] = {"$search": keyword}
            
            source_headings = list(db.headings.aggregate(
                [
                    {"$match": query_fields },
                    {"$sample": {"size": 1} }
                ]
            )
                                  )
            if source_headings and len(source_headings) > 0:
                heading = source_headings[0]
                heading_source_name = s
                break
                
        # did we get an answer?
        if heading_source_name:
            random.shuffle(sources)
            index = sources.index(heading_source_name)
            return {"title": heading["title"], "sources": sources, "index": index, "link": heading["link"]}
    
    # if here, not found, try without keyword
    if keyword:
        return build_heading_quiz(answers, sources_subset=sources_subset)
    else:
        return None

def build_default_quiz():
    
    # get a prime or a non trivial odd between 100 and 200. at bit clumsy ...
    primes = []
    odds = []
    for num in range(100, 200):
        for i in range(2, num):
            if (num % i) == 0:
                if (num % 2) == 1 and (num % 5) != 0:
                    odds.append(num)
                break
        else:
            primes.append(num)
        
    
    # create Yes/No distribution
    answers = ["Yes", "No"]
    random.shuffle(answers)    
    number = random.sample(primes, 1)[0] if random.random() < 0.5 else random.sample(odds, 1)[0]
    answer = "Yes" if number in primes else "No"
    
    title = "Could not find suitable heading. This will have to do ... is %d a prime number?" % number
    
    return {"title": title, "sources": answers, "index": answers.index(answer), "link": None}


def get_sources():
    return [source for source in get_db().sources.find()]

def get_user_info(username):

    info = get_db().users.find_one({"username": username})
    if not info:
        info = {
            "username": username,
        }
    if not "quizs" in info:
        info["quizs"] = 0
    if not "sources" in info:
        info["sources"] = [1,2,3,4]

    return info

def set_user_info(username, info):

    key = {"username": username}
    get_db().users.replace_one(key, info, True)



import logging
import os

from telegram import (Poll, ParseMode, KeyboardButton, KeyboardButtonPollType,
                      ReplyKeyboardMarkup, ReplyKeyboardRemove)
from telegram.ext import (Updater, CommandHandler, PollAnswerHandler, PollHandler, MessageHandler,
                          Filters)

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)


def start(update, context):
    update.message.reply_text("Headings Quiz Bot, (c) Dror Kessler 2020\n"
                              "headings sources from public rss feeds\n"
                              "\n"
                              "Please select /quiz or /help for more commands")
    new_job = context.job_queue.run_once(start_post_timer, 2, context=update)

def start_post_timer(context):
    update = context.job.context
    chat_id = update.effective_chat.id
    quiz(update, context)
    #context.bot.send_message(chat_id, text="come on ...")  
        
def quiz(update, context, qs=2):

    info = get_user_info(update.effective_chat.username)
    info["quizs"] = info["quizs"] + 1
    set_user_info(update.effective_chat.username, info)

    # extract keyword text
    text = update.effective_message.text
    toks = text.split(' ', 1)
    keyword = toks[1] if len(toks) > 1 else None
    
    q = build_heading_quiz(qs, keyword=keyword, sources_subset=info["sources"])
    if not q:
        q = build_default_quiz()
        
    questions = q["sources"]
    prefix = "Where was this heading published?\n\n"  if info["quizs"] <= 3 else ""
    message = update.effective_message.reply_poll(prefix + q["title"],
                                                  questions, type=Poll.QUIZ, correct_option_id=q["index"])
    # Save some info about the poll the bot_data for later use in receive_quiz_answer
    payload = {message.poll.id: {"chat_id": update.effective_chat.id,
                                 "message_id": message.message_id,
                                 "q": q,
                                 "qs": qs}}
    context.bot_data.update(payload)

def quiz_post_timer(context):
    quiz_data = context.job.context
    msg = ""
    if quiz_data["q"]["link"]:
        msg += quiz_data["q"]["link"] + "\n\n"
    context.bot.send_message(quiz_data["chat_id"], text=msg + "/quiz, /quiz3, /quiz4 or /help")  
            

def receive_quiz_answer(update, context):
    # the bot can receive closed poll updates we don't care about
    if update.poll.is_closed:
        return
    if update.poll.total_voter_count == 3:
        try:
            quiz_data = context.bot_data[update.poll.id]
        # this means this poll answer update is from an old poll, we can't stop it then
        except KeyError:
            return
        context.bot.stop_poll(quiz_data["chat_id"], quiz_data["message_id"])
        
    if update.poll:
        quiz_data = context.bot_data[update.poll.id]
        chat_id = quiz_data["chat_id"]
        new_job = context.job_queue.run_once(quiz_post_timer, 2, context=quiz_data)

        
def help_handler(update, context):
    update.message.reply_text("/quiz - get a quiz\n"
                              "/quiz3 - get a quiz with 3 answers\n"
                              "/quiz4 - get a quiz with 4 answers\n"
                              "\n"
                              "/help - get this help message\n"
                              "/short - list shortcuts\n"
                              "/sources - list sources\n"
                             )

def short_handler(update, context):
    update.message.reply_text("/q - /quiz\n"
                              "/q3 - /quiz3\n"
                              "/q4 - /quiz4\n"
                              "\n"
                              "/q <keyword> - filter for keyword\n"
                              "\n"
                              "/h - /help\n"
                             )

def sources_handler(update, context):
    msg = ""
    index = 0
    info = get_user_info(update.effective_chat.username)
    for source in get_sources():
        index = index + 1;
        marker = "*" if index in info["sources"] else ""
        msg += (str(index) + marker + " " + source["name"] + " - " + source["rss"] + "\n")
    update.message.reply_text(msg)
                              

def main():
    logger.info("creating updater")
    updater = Updater(os.environ['TEL_BOT_TOKEN'], use_context=True)
    dp = updater.dispatcher
    dp.add_handler(CommandHandler('start', start))
    
    dp.add_handler(CommandHandler('quiz', quiz))
    dp.add_handler(CommandHandler('q', quiz))
    dp.add_handler(CommandHandler('quiz3', lambda update,context: quiz(update, context, 3)))
    dp.add_handler(CommandHandler('q3', lambda update,context: quiz(update, context, 3)))
    dp.add_handler(CommandHandler('quiz4', lambda update,context: quiz(update, context, 4)))
    dp.add_handler(CommandHandler('q4', lambda update,context: quiz(update, context, 4)))
    dp.add_handler(PollHandler(receive_quiz_answer))
                              
    dp.add_handler(CommandHandler('help', help_handler))
    dp.add_handler(CommandHandler('h', help_handler))
    dp.add_handler(CommandHandler('short', short_handler))
    dp.add_handler(CommandHandler('sources', sources_handler))

    logger.info("starting to poll")
    updater.start_polling()

    updater.idle()


if __name__ == '__main__':
    print('Bot starting ...')
    main()
