/*
Bot Class:

Contains the FSM that controls the state of the bot.
Will access information from the 
*/

var StateMachine = require('javascript-state-machine');
var _ = require('lodash');
const chalk = require("chalk");
const fs = require("../firebase/firestore")
const { v4:newUuid, parse } = require('uuid');
var moment = require('moment');

module.exports = class Brain {
    
    // init an fsm
    constructor(){
        this.fsm = new StateMachine({
            //init: 'InitState',
            transitions: [
              {name: 'initialize', from: 'none', to: 'InitState'},
              {name: 'costRequest', from: 'InitState', to:'RequestState'}, // user makes a request -> a request is detected
              {name: 'ideaSubmission', from: 'RequestState', to:'ReviewState'}, // user submits an idea, goes to review
              {name: 'reset', from: "*", to: 'InitState'}, // probably won't use very often
              {name: 'goto', from: "*", to: function(s){ return s}} 
            ],
            methods: {
              onCostRequest: () => {
                console.log("Cost Request");
              },
              onInitialize: () => {
                console.log("Initializing.....");
              },
              onIdeaSubmission: () => {
                console.log('Submitted')
              },
              onReset: () => {
                console.log('Reset')
              },
            }
          });
        
        //key words for the bot to look out for
        this.productNamesCost = [{
            name: "logo",
            cost: "$60-150"
        },
        {
            name: "logos",
            cost: "$60-150"
        },
        {
            name: "portrait",
            cost: "$65-100"
        },
        {
            name: "book illustrations",
            cost: "$150-200"
        },
        {
            name: "covers",
            cost: "$90-150"
        }]

        this.productNames = ["logo", "logos", "portrait", "book illustrations", "covers"]

        this.greeting = 'Thank you for the inquiry!\nHere is a quick price list of my most popular products!'

        this.disclaimer = "\nThis action was completed by a bot.\nPlease contact the developer if you have any issues.\n"

        // object to hold how wait time - this should be set by the user (in hours)
        this.waitTime = 12

        // should be one per instance of this class
        this.UID = newUuid();

        this.status = 'Just Created'

        // init the bot
        this.fsm.initialize();
    }
    
    generatePriceList(){
        /**Generate a price list based on the products above */
        var priceListString = ''
        for(var i = 0; i < this.productNamesCost.length; i++){
            priceListString += `${this.productNamesCost[i].name} range from ${this.productNamesCost[i].cost}.\n`
        }
        return priceListString
    }

    /* Find the keyword with the most occurences NOT USED*/
    async findKeywords(wordList){
        //make function into promise?
        console.log("WE REACHED THE KEYWORD FINDING!>>>>>>")
        var wordCount = _.countBy(wordList)

        // omit uneeded keys
        var keys = _.omitBy(wordCount, (value, key) => {
            return !this.productNames.includes(key);
        });

        // if it is undefined then return empty string
        if(_.isEmpty(keys)){
            return ""
        }

        console.log(keys)

        // find the key with the most occurences
        var mostOccur = Object.keys(keys).reduce((a, b) => keys[a] > keys[b] ? a : b);
        var costRange = this.productNamesCost.find(e => e.name === mostOccur);
        var mostOccurCapitalize = mostOccur[0].toUpperCase() + mostOccur.slice(1);

        //console.log("WE HAVE FINISHED THE KEYWORD FINDING!>>>>>>")

        return `It seems like you're requesting a ${mostOccur}. ${mostOccurCapitalize} ranges from ${costRange.cost}.\n\n` 
    }

    respondToCostRequest(lcWordList, customerName){
        return new Promise(async (resolve) => {
            //console.log("WE REACHED THE RESPONDING>>>>>>")
            var response = ""
            response = `Hi, ${customerName}! 👋\n`;
            response += `Thank you for the inquiry! Here's a list of my most popular products:\n${this.generatePriceList()}\n`;
            response += `Can you describe your idea in a couple of sentences?`
            response += "\n\n\n" + this.disclaimer;
            // send the response out
            resolve(response);
        })
    }

    // handle the idea submission
    respondToIdeaSubmission(msg, usn){
        var requestFromClient = {};
        var guid = newUuid();

        return new Promise(async (resolve) => {
            console.log(chalk.yellowBright("responding to idea submission..."))
            
            // get data ready to post
            requestFromClient[guid] = {
                name: usn,
                dateCreated: new Date().toISOString(),
                status: "Not Completed",
                text: msg
            }

            // post
            var completed = await fs.postRequest(usn, requestFromClient)

            resolve(completed);

        })
    }

    updateStatus(str){
        this.status = str;
        console.log(chalk.yellow(this.status))
    }


    respond(incomingMessage, customerName, serverCallback, ){
        // this is the sole entry point into the class
        var response = "";
        var lc = incomingMessage.split(' ');

        // handle the initState
        console.log(chalk.yellowBright("from respond method...\n"))

        // handle submission of an idea
        if(this.fsm.state === 'RequestState'){
            this.respondToIdeaSubmission(incomingMessage, customerName)
            .then((resp) => {
                this.updateStatus("Submitted Idea Success, changing state...")
                // might not need to transition state here
                var response = `We've just submitted the idea for @LadyNefertiti to review!\n` +
                                `She should respond within the next ${this.waitTime} hours.` +
                                `When she does we'll notify you if your request was accepted!\n\n` + 
                                `You can send more text of your idea if you'd like while you wait!\n\n` + 
                                `Feel free to make another request using the command /request.\n` +
                                `\nIf you have any questions, do "/help" \n` +
                                `If you would like to report an issue, do "/issue"`+
                                `${this.disclaimer}`

                serverCallback(response, 'InitState')
            }).catch(e => {
                serverCallback(`It looks like we ran into an error: ${e}`)
            })
        }

        // use a switch statememnt instead 
        // handle transitioning out of InitState
        if(this.fsm.state === 'InitState'){
            // updating
            this.updateStatus("Handling Init State...")

            this.respondToCostRequest(lc, customerName)
                .then((resp) => {
                    this.updateStatus("Response to Request Success, changing state...")
                    
                    // transition state
                    //this.fsm.costRequest();

                    

                    // transition to the regular state
                    serverCallback(resp, 'RequestState');
                }).catch(e => console.log(chalk.red(`Responding to Cost Request Failed with error: ${e}`)));
        }

        
        
    }
}