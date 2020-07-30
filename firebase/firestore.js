// this will hold all of the firebase stuff that I'll need
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://commissions-cs-bot.firebaseio.com"
});
