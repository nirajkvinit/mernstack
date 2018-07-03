'use strict';

require('babel-polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongodb = require('mongodb');

var _issue = require('./issue.js');

var _issue2 = _interopRequireDefault(_issue);

var _sourceMapSupport = require('source-map-support');

var _sourceMapSupport2 = _interopRequireDefault(_sourceMapSupport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sourceMapSupport2.default.install();

let dbConnection;
let db;

const app = (0, _express2.default)();
app.use(_express2.default.static('static'));
app.use(_bodyParser2.default.json());

app.get('/api/issues', (req, res) => {
    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }
    console.log(filter);

    db.collection('issues').find(filter).toArray().then(issues => {
        const metadata = { total_count: issues.length };
        res.json({ _metadata: metadata, records: issues });
    }).catch(error => {
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
    const err = _issue2.default.validateIssue(newIssue);
    if (err) {
        res.status(422).json({ message: `Invalid request: ${err}` });
        return;
    }

    db.collection('issues').insertOne(_issue2.default.cleanupIssue(newIssue)).then(result => {
        db.collection('issues').find({ _id: result.insertedId }).limit(1).next();
    }).then(newissue => {
        res.json(newissue);
    }).catch(error => {
        console.log('error');
        res.status(500).json({ message: `Internal Server Error ${error}` });
    });
});

_mongodb.MongoClient.connect('mongodb://localhost').then(connection => {
    dbConnection = connection;
    db = dbConnection.db('issuetracker');

    app.listen(3000, () => {
        console.log('App started on port 3000');
    });
}).catch(error => {
    console.log('ERROR:', error);
});
//# sourceMappingURL=server.js.map