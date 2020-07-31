// just gonna use this for storing documents
const firestore = require("./firebase/firestore");

getQuote().then(res => {
    console.log(res.body);
    const obj = JSON.parse(res.body);
    const objUsing = {
        name: "ike",
        age: 27
    }

    // should send to the database
    return db.collection('sampleData').doc('Persons')
    .set(objUsing).then(() => {
        console.log('added somethig to the database');
    });
})