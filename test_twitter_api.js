const { Autohook, setWebhook, validateWebhook, WebhookURIError, RateLimitError } = require('twitter-autohook');
const util = require('util');
const request = require('request');
const url = require('url');
const http = require('http');
const dotenv = require('dotenv').config();

const oAuthConfig = {
    oauth_token: process.env.TWITTER_ACCESS_TOKEN, 
    oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

const post = util.promisify(request.post);

async function markAsRead(messageId, senderId) {
    const requestConfig = {
      url: 'https://api.twitter.com/1.1/direct_messages/mark_read.json',
      form: {
        last_read_event_id: messageId,
        recipient_id: senderId,
      },
      oauth: oAuthConfig,
    };

    console.log("marking as read")
    await post(requestConfig);
}

async function indicateTyping(senderId) {
    const requestConfig = {
      url: 'https://api.twitter.com/1.1/direct_messages/indicate_typing.json',
      form: {
        recipient_id: senderId,
      },
      oauth: oAuthConfig,
    };

    console.log("marking as typing")
    await post(requestConfig);
}

// saying hi
async function sayHi(event){
    // should have been already checked
    if (!event.direct_message_events) {
        return;
    }

    // Messages are wrapped in an array, so we'll extract the first element
    const message = event.direct_message_events.shift();

    // We check that the message is valid
    if (typeof message === 'undefined' || typeof message.message_create === 'undefined') {
        return;
    }

    // We filter out message you send, to avoid an infinite loop
    if (message.message_create.sender_id === message.message_create.target.recipient_id) {
        return;
    }

    console.log("passed all checks.")

    // mark as read and typing
    await markAsRead(message.message_create.id, message.message_create.sender_id);

    console.log("marked as read")
    await indicateTyping(message.message_create.sender_id);

    // prepare and send the reply
     // Prepare and send the message reply

     // get the person you are replying to
    const senderScreenName = event.users[message.message_create.sender_id].screen_name;


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

    // await the posting because async
    console.log("message is posting")
    await post(requestConfig);
}

(async start => {
  try {
    const webhook = new Autohook({
        env:"devcorenlp",
        port:7071
    });
    
    // Removes existing webhooks
    await webhook.removeWebhooks();
    
    // Listens to incoming activity
    webhook.on('event',  async (event) => {
        // say hi back
        if(event.direct_message_events) {
            console.log("got user message event")
            await sayHi(event)
        }
    });
    await webhook.start();
    
    // Subscribes to your own user's activity
    await webhook.subscribe(oAuthConfig);  
  } catch (e) {
    // Display the error and quit
    console.error(e);
    //process.exit(1);
  }
})();