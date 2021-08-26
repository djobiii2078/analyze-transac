/**
 * Author : Djob Mvondo
 * 06-08-2021
 * Wrapper for the school service interface
 * exposes the required APIs to the dashboard 
 */
const express = require('express');
const router = express.Router();
//const jwt = require('jwt');
//const config = require('./config.json');

const userService = require('../users/user.service');
const schoolService = require('./school.service');

// routes
//router.post('/authenticate', authenticate);
router.post('/register/:userId', register);
router.get('/:userId', getAll);
//router.get('/current', getCurrent);
router.get('/:id/:userId', getById);
router.get('/mine/:userId',getMineSchool);
//router.get('/search/:region/:department/:userId',getSchools);
router.put('/:id/:userId', update);
router.delete('/:id/:userId', _delete);

module.exports = router;


function checkToken(req,res){

  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
});
}

function register(req, res, next) {

   // checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if (userService.isAdmin(JSON.parse(role).role)){
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

   // checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {

            if (userService.isAdmin(JSON.parse(JSON.stringify(role)).role)){
                schoolService.getAll()
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err))
    
}

function getMineSchool(req,res,next){
    //checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if (userService.isAdmin(JSON.parse(JSON.stringify(role)).role)){
                //console.log(JSON.parse(role).role);
                schoolService.getAll()
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
            }

            else if (userService.isRegionRole(JSON.parse(JSON.stringify(role)).role)){
                userService.getRegion(req.user.sub)
                .then(region => {
                    schoolService.getAllRegion(JSON.parse(JSON.stringify(region)).region)
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
                })
            }

            else if (userService.isDepartmentRole(JSON.parse(JSON.stringify(role)).role)){
                userService.getRegion(req.user.sub)
                .then(region => {
                    schoolService.getAllDept(JSON.parse(JSON.stringify(region)).region)
                    .then(schools => res.json(schools))
                    .catch(err => next(err));
                })
            }
        })
        .catch(err => next(err))
}

function getById(req, res, next) {

    //checkToken(req,res);
    schoolService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
   // checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if(userService.isAdmin(JSON.parse(JSON.stringify(role)).role)){
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
    //checkToken(req,res);
    userService.getRoleById(req.user.sub)
        .then(role => {
            if(userService.isAdmin(JSON.parse(JSON.stringify(role)).role)){
                schoolService.delete(req.params.id)
                .then(() => res.json({}))
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));
    
}
