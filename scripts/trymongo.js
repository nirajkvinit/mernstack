'use strict';
const MongoClient = require('mongodb').MongoClient;

function usage() {
    console.log('Usage:');
    console.log('node', __filename, '<option>');
    console.log('Where option is one of:');
    console.log(' callbacks - Use the callbacks paradigm');
    console.log(' promises - Use the Promises paradigm');
    console.log(' generator - Use the Generator paradigm');
    console.log(' async - Use the async module');
}

if(process.argv.length < 3) {
    console.log("Incorrect number of arguments");
    usage();
} else {
    switch(process.argv[2]) {
        case 'callbacks':
            testWithCallbacks();
            break;
        case 'promises':
            testWithPromises();
            break;
        case 'generator':
            testWithGenerator();
            break;
        case 'async':
            testWithAsync();
            break;
        default:
            console.log("Invalid option:", process.argv[2]);
            usage();
            break;
    }
}

function testWithCallbacks() {
    MongoClient.connect('mongodb://localhost/playground', function(err, databases){
        
        const playground = databases.db('playground');

        playground.collection('employees').insertOne({id: 1, name: 'A. Callback'}, function(err, result){
            console.log("Result of inser:", result.insertedId);
            playground.collection('employees').find({id: 1}).toArray(function(err, docs){
                console.log('Result of find:', docs);
                db.close();
            });
        });
    });
}

function testWithPromises() {
    let db;
    let dbConnection;
    MongoClient.connect('mongodb://localhost/playground').then(connection => {
        dbConnection = connection;
        db = dbConnection.db('playground');
        return db.collection('employees').insertOne({id: 2, name: 'B. Promises'});
    }).then(result => {
        console.log("Result of insert:", result.insertedId);
        return db.collection('employees').find({id:2}).toArray();
    }).then(docs => {
        console.log('Result of find:', docs);
        dbConnection.close();
    }).catch(err => {
        console.log('Error', err);
    });
}

function testWithGenerator() {
    const co = require('co');
    co(function*() {
        const dbConnection = yield MongoClient.connect('mongodb://localhost/playground');
        const db = dbConnection.db('playground');

        const result = yield db.collection('employees').insertOne({id:3, name: 'C. Generator'});
        console.log('Result of insert: ', result.insertedId);

        const docs = yield db.collection('employees').find({id: 3}).toArray();
        console.log('Result of find:', docs);

        dbConnection.close();
    }).catch(err => {
        console.log('ERROR ', err)
    });
}

function testWithAsync() {
    const async = require('async');

    let db;
    let dbConnection;
    async.waterfall([
        next => {
            MongoClient.connect('mongodb://localhost/playground', next);
        },
        (connection, next) => {
            dbConnection = connection;
            db = dbConnection.db("playground");
            db.collection('employees').insertOne({id: 4, name: 'D. Async'}, next);
        },
        (insertResult, next) => {
            console.log('Insert Result:', insertResult.insertedId);
            db.collection('employees').find({id: 4}).toArray(next);
        },
        (docs, next) => {
            console.log('Result of find:', docs);
            dbConnection.close();
            next(null, 'All done');
        }
    ],(err, result) => {
        if(err) {
            console.log('Error', err);
        } else {
            console.log(result);
        }
    });
}