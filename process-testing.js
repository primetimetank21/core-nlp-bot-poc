// this is the main testing file where we test state change
let bot = require('./bot');

// start the bot
var responder = new bot(); 

// someone sends a message
var msg = "Please Lmk when you re taking comissions again. I definitely would like to purchase a logo from you."

responder.respond(msg.toLowerCase(), "Megan", (bot_resp) => { console.log(bot_resp)});

//console.log(bot_response);
