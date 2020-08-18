// this will hold all of the firebase stuff that I'll need
var admin = require("firebase-admin");
const { v4:newUuid, parse } = require('uuid');
var chalk = require("chalk");


// get the credentials
var serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://commissions-cs-bot.firebaseio.com"
});

// init firestore
const db = admin.firestore();

// works!
module.exports = {
    // post an example request out to firebase
    postExampleRequest(name){
        var guid = newUuid();
    
        var requestFromClient = {}
    
        // put the request info here
        requestFromClient[guid] = {
            name: name,
            dateCreated: new Date().toISOString(),
            status: "Not Completed",
            idea: "I want t a pink fluffy hippo."
        }
    
        return db.collection('sampleData').doc(name)
        .set(requestFromClient, { merge: true }).then(() => {
            console.log('added something to the database');
        });
    
    },
    postRequest(id, requestFromClient){

        // post request to firestore
        return new Promise((resolve, reject) => {
            db.collection('requests').doc(id).set(requestFromClient, { merge: true }).then(() => {
                console.log('added something to the database');
                resolve("request posted successfully");
            }).catch((e) => {
                console.log(chalk.red(`Posting Request To Firebase Failed with error: ${e}`));
            });
        })
    },
    addIdeaToRequest(id, text){
        // fetch the information from the database and then add it back
        return new Promise(async (resolve, reject) => {
          const request = await db.collection('requests').doc(id).get();
          if(!request.exists){
              console.log(chalk.red("the document " + id + " does not exist."))
              reject("the document " + id + " does not exist.")
          } else {
              var data = request.data();
              console.log(chalk.greenBright("Document Retreieved: " + data.text ))

              var finalized = text.replace(",", " ");
              // update the text by concentation
              data.text += " " + finalized;

              // then post the information.
              db.collection('requests').doc(id).set(data ,{merge: true}).then(() => {
                console.log('updated the database');
                resolve(" content updated sucessfully");
              }).catch((err) => {
                console.log(chalk.red(`Posting Request To Firebase Failed with error: ${e}`));
              })
          }
        })
    }
}

