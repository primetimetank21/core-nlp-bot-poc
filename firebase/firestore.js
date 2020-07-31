// this will hold all of the firebase stuff that I'll need
var admin = require("firebase-admin");
const { v4: uuidv4 } = require('uuid');

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

postHuman("wilk33", 29363);