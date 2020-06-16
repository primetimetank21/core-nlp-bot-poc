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

// assumes that the nlp is running on port 9000
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
    // send the immediate file
    res.sendFile(__dirname + "/index.html");
});

// get the properties and pipeline
const props = new CoreNLP.Properties({
    annotators: 'tokenize,ssplit,pos,lemma,ner,parse',
}); 

// create a new pipline, should only be created once per request
const pipeline = new CoreNLP.Pipeline(props, 'English');

// must use the default
const expr = new CoreNLP.default.simple.Expression(
    'I love your portraits! how much do you charge for logos?',
    '[]* (how much) []* (charge) []* (logos|portraits|book illustrations)');

pipeline.annotateTokensRegex(expr, true)
    .then(expr => {
        // returns an Expression Object
        // should cycle through each one of the sentences and see if there is a match
        expr.sentence(1).matches().map(match => {
            // then you cycle through this
            console.log('matched: ', match._data[1]); // can access the inner matches
        });
    }).catch(err => {
        console.log('err', err)
    })

//console.log(sent)
// pipeline.annotate(sent)
//     .then(sent => {
//         // parsed tree
//         var parsed = sent.parse();

//         // json tree - write to file
//         var jsonTree = CoreNLP.default.util.Tree.fromSentence(sent).dump()
//         var path = "data.json";

//         console.log(jsonTree)
//     })
//     .catch(err => {
//         console.log('err', err);
//     });
// // listeners
// const port = process.env.PORT || 4000
// app.listen(port, () => {
//     console.log(`listening on port: ${port}`);
// })

//console.log(props);