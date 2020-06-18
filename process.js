// imports 
const CoreNLP = require('corenlp')

// DOCS: https://gerardobort.github.io/node-corenlp/docs/index.html

// export it one time
module.exports = class Process {

    
    constructor(annotators, language){
        // set the pipeline
        // might want to wrap this into a try catch statement
        this.pipeline = this.startPipeline(annotators, language)
        
        // holds all the extra variable that this needs
        this.state = {
            patterns: ['[]* (how much) []* (charge) []* (logos|portraits|book illustrations)'],
            products: ['logos', 'portraits', 'book illustrations'],
            rules: [
                {
                    // ruleName, pattern, which token mode it uses
                    "name": "Cost Request",
                    "pattern": "[]* (how much) []* (charge) []* (logos|portraits|book illustrations)",
                    "mode": "TOKEN",
                    "numExpectedValues": 3 // to limit iteration
                }
            ],
            context: {
                history: [],
                
            }
        }

    }

    // initialize the pipeline
    startPipeline(annotators, lang){
        const props = new CoreNLP.Properties({
            annotators: annotators,
        }); 
        const pipeline = new CoreNLP.Pipeline(props, lang);
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
    
    // analyze the tokens
    runPipeline(expr, rule, serverCallback){

        switch(rule.mode){
            case "TOKEN":
                // to do
                this.pipeline.annotateTokensRegex(expr, true)
                    .then(expr => {
                    //cycle thru each of the sentences
                    for(var i = 0; i <= expr.sentence.length; i++){
                        // if there is a match in the sentence
                        if(expr.sentence(i).matches().length > 0) {
                            expr.sentence(i).matches().map(match => {

                                // display the values
                                for(var j = 1; j <= rule.numExpectedValues; j++){
                                    console.log(match._data[j].text);
                                }
                                return
                            })
                            this.updateContext(rule.name, true);
                            serverCallback("We have detected a cost request!") // call back to the server
                        } else {
                            // if not match
                            this.updateContext(rule.name, false);
                            serverCallback("No cost request detected.")
                        }
                    }
                }).catch(err => {
                    console.log('err', err)
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

            // run the pipeline
            const result = await this.runPipeline(expr, rule, serverCallback);

        }));
    }
}