// imports
const CoreNLP = require('corenlp')

// DOCS: https://gerardobort.github.io/node-corenlp/docs/index.html

// export it one time
module.exports = class Process {


    constructor(annotators, language){
        // set the connector up
        const connector = new CoreNLP.ConnectorServer({ dsn: "https://corenlp.run" })

        // set the pipeline
        // might want to wrap this into a try catch statement
        this.pipeline = this.startPipeline(annotators, language, connector)

        // holds all the extra variable that this needs
        this.state = {
            patterns: ['[]* (how much) []* (charge) []* (logos|portraits|book illustrations)'],
            products: ['logos', 'portraits', 'book illustrations'],
            rules: [
                {
                    // ruleName, pattern, which token mode it uses
                    "name": "Cost Request Strong",
                    "pattern": "[]* (how much) []* (charge|cost) []* (logos|portraits|book illustrations)",
                    "mode": "TOKEN",
                    "numExpectedValues": 3, // to limit iteration
                    "response": "We've detected a strong request!" // not final
                },
                {
                    // a second rule to weakly determine it - latest addition
                    "name": "Cost Request Weak",
                    "pattern": "(logo | logos | book illustrations | portrait | portraits)",
                    "mode": "TOKEN",
                    "numExpectedValues": 3,
                    "response": "We've detected a weak request!" // not going to be the way I do this in the future
                }
            ],
            context: {
                history: [],

            }
        }

    }

    // initialize the pipeline
    startPipeline(annotators, lang, connector){
        const props = new CoreNLP.Properties({
            annotators: annotators,
        });
        const pipeline = new CoreNLP.Pipeline(props, lang, connector);
        return pipeline
    }

    // update the state - simple update
    updateState(key, value){
        this.state[key] = value;
    }

    // create the expression
    initExpression(incoming, pattern){
        return new CoreNLP.default.simple.Expression(
            incoming,
            pattern);
    }

    updateContext(key, value){
        this.state.context[key] = value;
        console.log(this.state.context);
    }

    respond(server_cb){

        var context = this.state.context;
        var rules = this.state.rules;
        var result = []
        for(var i = 0; i < rules; i++){

            // if that rule has not been triggered yet
            if(context[rules[i].name] === "undefined"){
                continue;
            }

            //else display the message in the callback
            console.log("Response: " + rules[i].response)
            result.push("\n" + rules[i].response);
        }

        //server_cb(result.join(''));
    }

    // analyze the tokens
    runPipeline(expr, rule){

        switch(rule.mode){
            case "TOKEN":
                // to do
                this.pipeline.annotateTokensRegex(expr, true)
                    .then(expr => {
                        console.log(expr.sentence(0).matches())
                    //cycle thru each of the sentences
                    for(var i = 0; i <= expr.sentence.length; i++){

                        // if there is a match in the sentence
                        if(expr.sentence(i).matches().length > 0) {
                            // display the words show the match
                            expr.sentence(i).matches().map(match => {

                                // display the values
                                for(var j = 1; j <= rule.numExpectedValues; j++){
                                    console.log("matched: ", match._data.text);
                                    console.log("\n")
                                }
                            })

                            // set the state
                            this.updateContext(rule.name, true);

                        } else {
                            // if not match
                            this.updateContext(rule.name, false);
                        }
                    }



                }).catch(err => {
                    if(err.message == 'Cannot read property \'matches\' of undefined') {
                        console.log("No matches found.")
                    } else {
                        console.log(err.message)
                    }
                })
                break;
            default:
                throw "Only the TOKEN mode is implemented!"
        }
    }

    // process an input - should be called on the on input event
    async run(incomingMsg, serverCallback){
        // for each rule
        await Promise.all(this.state.rules.map( async (rule) => {
            // create an expression
            const expr = this.initExpression(incomingMsg, rule.pattern);
            //console.log(expr)

            // run the pipeline
            const result = await this.runPipeline(expr, rule);

        }));

        // can evaulate here
        // do the server call back here
        console.log("getting callee?")
        this.respond(serverCallback);
    }
}
