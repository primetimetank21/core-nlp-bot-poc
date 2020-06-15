// main js file, will hold the server

/*
https://vegibit.com/vue-js-express-tutorial/
*/

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // not sure what this is for
const dotenv = require('dotenv').config()

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
    res.json({
        message: 'With Love, Your Server'
    });
});

// listeners
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})