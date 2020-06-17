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
                    "mode": "TOKEN"
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
    
    // analyze the tokens
    runPipeline(expr, mode){

        switch(mode){
            case "TOKEN":
                // to do
                this.pipeline.annotateTokensRegex(expr, true)
                    .then(expr => {
                    //cycle thru each of the sentences
                    for(var i = 0; i <= expr.sentence.length; i++){
                        // if there is a match in the sentence
                        if(expr.sentence(i).matches().length > 0) {
                            expr.sentence(i).matches().map(match => {
                                console.log(match._data[1]);
                            })
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
    async run(incomingMsg){

        // // for each rule
        // await Promise.all(this.state.rules.map( async (rule) => {
        //     // create an expression
        //     const expr = this.initExpression(incomingMsg, rule.pattern);

        //     // run the pipeline
        //     const result = await this.runPipeline(expr, rule.mode);
        // }));

        const expr = this.initExpression(incomingMsg, this.state.patterns[0]);

        // this should be in a separate function?
        this.pipeline.annotateTokensRegex(expr, true)
            .then(expr => {
                //cycle thru each of the sentences
                for(var i = 0; i <= expr.sentence.length; i++){
                    // if there is a match in the sentence
                    if(expr.sentence(i).matches().length > 0) {
                        expr.sentence(i).matches().map(match => {
                            console.log(match._data);
                        })
                    }
                }
            // // returns an Expression Object
            // // should cycle through each one of the sentences and see if there is a match
            // expr.sentence(1).matches().map(match => {
            //     // then you cycle through this
            //     console.log('matched: ', match._data[1]); // can access the inner matches
            // });
        }).catch(err => {
            console.log('err', err)
        })
    }

    

}