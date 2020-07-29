const { Autohook, setWebhook, validateWebhook, WebhookURIError, RateLimitError } = require('twitter-autohook');
const util = require('util');
const request = require('request');
const url = require('url');
const http = require('http');
const dotenv = require('dotenv').config();

// this works
const PORT = 3000;

const post = util.promisify(request.post);

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

  // mark as read and indicate indicateTyping
  await markAsRead(message.message_create.id, message.message_create.sender_id, oAuthConfig);
  await indicateTyping(message.message_create.sender_id, oAuthConfig);

  const senderScreenName = event.users[message.message_create.sender_id].screen_name;

  // senderScreen name is the sender of the original message
  console.log(`${senderScreenName} says ${message.message_create.message_data.text}`);

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
            text: `Hi @${senderScreenName}! 👋`,
          },
        },
      },
    },
  };
  await post(requestConfig);
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
