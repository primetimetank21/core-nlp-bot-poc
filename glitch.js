const { Autohook, setWebhook, validateWebhook, WebhookURIError, RateLimitError } = require('twitter-autohook');
const util = require('util');
const request = require('request');
const url = require('url');
const http = require('http');
const dotenv = require('dotenv').config();
const chalk = require("chalk");

//** GLOBAL VARIABLES */
var bot = require('./bot_logic/bot');

// init bot
var responder = new bot();

// this works
const PORT = 3000;

const post = util.promisify(request.post);

const appId = "18419607";

// configuration for authN
const oAuthConfig = {
  token: process.env.TWITTER_ACCESS_TOKEN,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
};

// marks as read using the dm api
async function markAsRead(messageId, senderId, auth) {
  const requestConfig = {
    url: 'https://api.twitter.com/1.1/direct_messages/mark_read.json',
    form: {
      last_read_event_id: messageId,
      recipient_id: senderId,
    },
    oauth: auth,
  };

  await post(requestConfig);
}

// indicate that someone is typing
async function indicateTyping(senderId, auth) {
  // using the indicate typing endpoint send the recipient_id which is this bot
  const requestConfig = {
    url: 'https://api.twitter.com/1.1/direct_messages/indicate_typing.json',
    form: {
      recipient_id: senderId,
    },
    oauth: auth,
  };

  await post(requestConfig);
}

async function sayHi(event) {
  // if it is not a dm
  if (!event.direct_message_events) {
    return;
  }

  // get the first message  -> which is the target message
  const message = event.direct_message_events.shift();

  // if there is no message?
  if (typeof message === 'undefined' || typeof message.message_create === 'undefined') {
    return;
  }

  // if the messages are from the same person
  if (message.message_create.sender_id === message.message_create.target.recipient_id) {
    return;
  }

  // if the event is coming from me return 

  // console.log(chalk.blue("SENDER ID ===> " + message.message_create.sender_id))
  // console.log(chalk.blueBright("RECIEVER ID ===> " + message.message_create.target.recipient_id))
  // console.log(chalk.blueBright("MESSAGE JSON ===> " + JSON.stringify(message)));

  // stop talking to yourself
  if(message.message_create.source_app_id === appId){
    console.log(chalk.redBright("stop talking to yourself"));
    return;
  }

  // mark as read and indicate indicateTyping
  await markAsRead(message.message_create.id, message.message_create.sender_id, oAuthConfig);
  await indicateTyping(message.message_create.sender_id, oAuthConfig);

  const senderScreenName = event.users[message.message_create.sender_id].screen_name;

  // senderScreen name is the sender of the original message
  var incomingMessage = message.message_create.message_data.text;

  console.log(`${senderScreenName} says ${incomingMessage}`);

  // get the response
  responder.respond(incomingMessage.toLowerCase(), senderScreenName, async (bot_resp, target_state) => {

     // post the bot response
     const requestConfig = {
      url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
      oauth: oAuthConfig,
      json: {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: message.message_create.sender_id,
            },
            message_data: {
              text: bot_resp,
            },
          },
        },
      },
    };

    // post it
    console.log(chalk.yellow("Posting......"))
    post(requestConfig).then((res) => {
      // change state here
      //console.log(chalk.magenta(JSON.stringify(res)))

      //transition to the right state?
      responder.fsm.goto(target_state);

      responder.updateStatus(`State changed to ?: ${responder.fsm.state}\n\n=======`)
      return // maybe this would only mke it go once
    });

    //responder.fsm.goto('RequestState');
  });
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

(async start => {
  try {
    

    // create a new webhook
    const webhook = new Autohook({
        env:"devcorenlp",
        port:7071
    });

    // remove then start
    await webhook.removeWebhooks();
    await webhook.start();

    // if the event is a direct message then sayHi!
    webhook.on('event', async event => {
      if (event.direct_message_events) {
        await sayHi(event);
      }
    });

    // subscribe tio the account as a listener
    await webhook.subscribe({oauth_token: process.env.TWITTER_ACCESS_TOKEN, oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET});
  } catch (e) {
    console.error(e);

    // adjust for rate limiting
    if (e.name === 'RateLimitError') {
      await sleep(e.resetAt - new Date().getTime());
      process.exit(1);
    }
  }
})();
