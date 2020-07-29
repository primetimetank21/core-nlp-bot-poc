
//import
let Process = require('./process');

// create a new process
const pro = new Process('tokenize,ssplit,pos,lemma,ner,parse', "English");

// use the run function to process text
// for testing
pro.run("I want a logo.".toLowerCase(), (msg) => {
    console.log("\nDETECTION: \n" + msg)
});
