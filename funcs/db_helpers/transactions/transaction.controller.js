/**
 * Author : Djob Mvondo
 * 06-08-2021
 * Wrapper for the school service interface
 * exposes the required APIs to the dashboard 
 */
const express = require('express');
const router = express.Router();
const jwt = require('jwt');
const config = require('./config.json');

const userService = require('../users/user.service');
const schoolService = require('../schools/school.service');
const transactionService = require('./transaction.service')

// routes
//router.post('/authenticate', authenticate);
//The logic is that all the filtering is done on the client's side
// In order to limit the load on the server's side and limit access 
//patterns --- may lead to some issues here.

router.post('/register/:userId', register);
router.get('/:userId', getAll);
router.get('/refrain/:userId/:fromdata/:todate',getAllRefrain)
//router.get('/current', getCurrent);
router.get('/:id/:userId', getById);
//router.get('/mine/:id/:userId',getMineSchool);
//router.get('/search/:region/:department/:userId',getSchools);
router.put('/:id/:userId', update);
router.delete('/:id/:userId', _delete);

module.exports = router;


function checkToken(req,res){

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
}

/**
* @TODO: Handling uploads later
* Need to parse every line, convert school name to id
* Record the upload in an uploadRecordTable for audit 
* Give informations about bad lines to the client
* The Checking should be done on the client side 
* and the server should just upload and notify completion
*/

function register(req, res, next) {

    checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if (userService.isAdmin(role.json().role)){
                schoolService.create(req.body)
                .then(() => res.json({}))
                .catch(err => next(err));
            }
        })
        .catch(err => next(err))
    
}

/*@NOTICE
*Shouldn't be exposed
*/
function getAll(req, res, next) {

    checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if (userService.isAdmin(role.json().role)){
                schoolService.getAll()
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err))
    
}

function getMineSchool(req,res,next){
    checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if (userService.isAdmin(role.json().role)){
                schoolService.getAll()
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
            }

            else if (userService.isRegionRole(role.json().role)){
                userService.getRegion(req.user.sub)
                .then(region => {
                    schoolService.getAllRegion(region.json().region)
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
                })
            }
        })
        .catch(err => next(err))
}

function getById(req, res, next) {

    checkToken(req,res);
    schoolService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if(userService.isAdmin(role.json().role)){
                schoolService.update(req.params.id, req.body)
                .then(() => res.json({}))
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));
    
}

/**
 * @NOTICE: Not sure we should expose this API
 */
function _delete(req, res, next) {
    checkToken(req,res);
    userService.getRoleById(req.user.sub);
        .then(role => {
            if(userService.isAdmin(role.json().role)){
                schoolService.delete(req.params.id)
                .then(() => res.json({}))
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));
    
}
