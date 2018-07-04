import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
import Issue from './issue.js';
import SourceMapSupport from 'source-map-support';

SourceMapSupport.install();

let dbConnection;
let db;

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/api/issues', (req, res) => {
    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.effort_lte || req.query.effort_gte) {
        filter.effort = {};
    }

    if (req.query.effort_lte) {
        filter.effort.$lte = parseInt(req.query.effort_lte, 10);
    }
    if (req.query.effort_gte) {
        filter.effort.$gte = parseInt(req.query.effort_gte, 10);
    }

    db.collection('issues').find(filter).toArray()
    .then(issues => {
        const metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
});


app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();

    if (!newIssue.status) {
        newIssue.status = 'New';
    }
    const err = Issue.validateIssue(newIssue);
    if (err) {
        res.status(422).json({ message: `Invalid request: ${err}` });
        return;
    }

    db.collection('issues').insertOne(Issue.cleanupIssue(newIssue))
    .then(result => {
        db.collection('issues').find({ _id: result.insertedId }).limit(1)
        .next();
    })
    .then(newissue => {
        res.json(newissue);
    })
    .catch(error => {
        console.log('error');
        res.status(500).json({message: `Internal Server Error ${error}`});
    });
});

MongoClient.connect('mongodb://localhost').then(connection => {
    dbConnection = connection;
    db = dbConnection.db('issuetracker');

    app.listen(3000, () => {
        console.log('App started on port 3000');
    });
})
.catch(error => {
    console.log('ERROR:', error);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
});
