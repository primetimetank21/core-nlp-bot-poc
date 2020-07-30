// someone sends a message
var msg = "Please Lmk when you re taking comissions again. I definitely would like to purchase a logo from you."



const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // not sure what this is for
let bot = require('./bot_logic/bot');
const chalk = require("chalk");

// assumes that the nlp is running on port 9000
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

var responder = new bot();

// routes
app.get('/', (req, res) => {
     // no empty msgs
     if(!req.body.msg || req.body.msg === ""){
        console.log("There was an error. ")
        res.status(400).send({
            message: "Message Field cannot be empty."
        });
    }else {
        // put a try catch here
        let incomingMessage = req.body.msg;
        console.log(incomingMessage);

        // process the incoming msg
        // get a response
        responder.respond(incomingMessage.toLowerCase(), "Megan", (bot_resp) => { 
            console.log(chalk.green(bot_resp))
            res.end(bot_resp);
        });
    }
});



// listeners
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})




//console.log(bot_response);
