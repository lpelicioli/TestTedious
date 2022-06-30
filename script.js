"use strict";
var express = require('express');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


var databaseTest = require('./lib/SQL');
var logger = require('./lib/logger.js');


var app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static('www'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('*', async (req, res) => {
    res.redirect("/Home.html");
});


console.clear();


logger.info("Server started...", "SYST");


app.listen(80);
logger.log("Localhost ip      --> http://127.0.0.1/Home.html");

var settings = {
    server: 'ip',                                                    // update me
    authentication: {
        type: 'default',
        options: {
            userName: 'username',                                                     // update me
            password: 'password'                                                // update me
        }
    },
    options: {
        encrypt: false,
        appName: 'ServerTest',
        database: 'database',                                           // update me
        trustServerCertificate: true,
        rowCollectionOnRequestCompletion: false,
        requestTimeout: 0, // no timeout
        cancelTimeout: 20000
    },
}


databaseTest.connect(settings).then(
    logger.log("Connection to SQL server established!")
).catch(function(err){
    logger.error("Connection to SQL server refused!","SYST")
})

app.post('/massiveQuery', async (req, res) => {
    logger.warning("massiveQuery started!","SYST")
    var query = `
        SELECT  *
        FROM [database].[dbo].[dbEvents]
    `;                                                                      // update the [database] with the database name

    databaseTest.query(query).then(function (a) {
        console.log("answer")
        res.status(200).send(JSON.stringify(a))
    })
    .catch(function err(err) 
    {
        console.log(err)
        res.status(500)
    })



})


//old test for check if express cant manage reponse that take time
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('foo');
    }, 500000);
});



