// main js file, will hold the server

/*
https://vegibit.com/vue-js-express-tutorial/
*/

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // not sure what this is for
const dotenv = require('dotenv').config()
const CoreNLP = require('corenlp')
const fs = require('fs');
const util = require('util');
let Process = require('./process');

// init
const pro = new Process('tokenize,ssplit,pos,lemma,ner,parse', "English");

// assumes that the nlp is running on port 9000
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
    // send the immediate file
    res.sendFile(__dirname + "/index.html");
});

app.get('/init', (req, res) => {
    pro.run('I hate this.', (msg) => {
        console.log(msg);
        res.end("hello");
    });
})

// pro.run('I love your portraits! how much do you charge for logos?', (msg) => {
//     console.log("Hey! " + msg)
// });




// listeners
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})
