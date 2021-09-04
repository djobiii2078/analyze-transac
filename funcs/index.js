require('rootpath')();
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('db_helpers/_helpers/jwt');
const errorHandler = require('db_helpers/_helpers/error-handler');

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 4 * 1024 * 1024 * 1024 * 1024 //4GB max file(s) size
    },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./db_helpers/users/user.controller'));
app.use('/schools', require('./db_helpers/schools/school.controller'));
app.use('/transactions',require('./db_helpers/transactions/transaction.controller'));

// global error handler
//app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});