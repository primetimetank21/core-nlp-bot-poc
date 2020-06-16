// imports 
const CoreNLP = require('corenlp')

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
            context: {
                history: []
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
    
    // process an input - should be called on the on input event
    run(incomingMsg){

        // create the expression
        const expr = new CoreNLP.default.simple.Expression(
            incomingMsg,
            this.state.patterns);

        this.pipeline.annotateTokensRegex(expr, true)
            .then(expr => {
                // cycle thru each of the sentences
                for(var i; i < expr.sentence.length; i++){
                    // if there is a match in the sentence
                    if(expr.sentence(i) > 0) {
                        console.log("matched")
                    }
                }
            // returns an Expression Object
            // should cycle through each one of the sentences and see if there is a match
            expr.sentence(1).matches().map(match => {
                // then you cycle through this
                console.log('matched: ', match._data[1]); // can access the inner matches
            });
        }).catch(err => {
            console.log('err', err)
        })
    }

}