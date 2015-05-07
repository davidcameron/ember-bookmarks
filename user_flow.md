# User Flow
## Landing Page
1. Set up org
2. Sign in with Slack
3. About
4. App

## Set up Org
First show the user how to setup an [outgoing webhook](https://hobz.slack.com/services/new/outgoing-webhook)
1. Enter trigger word
2. Enter URL
3. Copy token
4. Write description (optional)
5. Write integration name (optional)
6. Upload icon (optional)

Then show the user how to setup an [incoming webhook](https://hobz.slack.com/services/new/incoming-webhook)
1. Post to channel (any channel works)
2. Copy URL
3. Write description (optional)
4. Write integration name (optional)
5. Upload icon (optional)

## App
Once a user has signed up, the see the app. "Ask a question" form at the top, then a list of questions (LIFO).
List of questions is all the questions for their org.
As the user types a question, we filter the questions below.
Each question has an answer form. If it's the logged in user's question, each answer will have an "accept" button.
Only one answer can be accepted per question.

# Tables
## Org
1. Incoming URL
2. Outgoing token

## Question
1. team_id
2. team_domain
3. channel_id
4. channel_name
5. timestamp
6. user_id
7. user_name
8. text

## Answer
1. team_id
2. team_domain
3. channel_id
4. channel_name
5. timestamp
6. user_id
7. user_name
8. text
9. question_id
10. status

# Endpoints
## Question, Answer, and Org.
Standard rest endpoints, with GET, POST, PUT, and DELETE.
Answer endpoint accepts a ``question_id`` filter param.
Both return LIFO.

## Messages from Slack
POST
This will parse out the first word of the ``text`` parameter.
If it's not "answer", this creates a question.
token
team_id
team_domain
channel_id
channel_name
timestamp
user_id
user_name
text
trigger_word

1. Parse out first word of the ``text`` param. If it's not "answer" (case insensitive), this is a question.
2. Match ``token`` to an org. Use that's org's ID for questions and answers.
3. If it's a question, send everything along to the question endpoint. Params match one-to-one.
  1. Search through other questions in the org.
  If there's a match above a certain threshold, pick the top match and Send Answer to Slack.
4. If it's an answer, remove "answer" from the ``text``. Look up the most recent question from that org and channel.
Set that as the answer's ``question_id``. Send it all along to the answer endpoint.

Find the last question asked in that org, and that channel. Set that as the ``question_id`` on the answer.

## Send Answer to Slack
If the question text starts with "answer", and there's an answer with that question ID, send it to Slack.
First, see if there's an accepted answer. If so send that one. Otherwise send the most recent answer.

Sends POST to Org's ``incoming_url``
One param, ``payload``. Send JSON with a ``text`` param.
"``text`` by ``user_name`` on ``formatted_time_stamp``"
payload={"text": "Tyrion Lannister was born in Casterly Rock - by David Cameron, May 6th, 2015"}
