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

function postHuman(name, age){
    var obj = {
        name: name,
        age: age
    } 

    return db.collection('sampleData').doc('Persons')
    .set(obj, { merge: true }).then(() => {
        console.log('added something to the database');
    });

}

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
    }
}

