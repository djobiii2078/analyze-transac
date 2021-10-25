/**
 * Author : Djob Mvondo
 * 06-08-2021
 * Interface for user handling
 * Update this file to improve the user handlers 
 */ 
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    getRoleById,
    getOperator,
    create,
    updateByUsername,
    update,
    delete: _delete,
    isAdmin,
    isRegionRole,
    isDepartmentRole,
    isOperatorRole,
    getRegion,
    getDepartment
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

function isAdmin(role){
     return (role == config.ADMIN_ROLE) ? true : false;
}

function isRegionRole(role){
    return (role == config.REGION_ROLE) ? true : false;
}

function isDepartmentRole(role){
    return (role == config.DEPARTMENT_ROLE) ? true : false; 
}

function isOperatorRole(role) {
    return (role == config.OPERATOR_ROLE) ? true : false; 
}

async function getRegion(id){
    return await User.findById(id,'region');
}

async function getDepartment(id){
    return await User.findById(id,'department');
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function getOperator(id){
    return await User.findById(id,'operatorname');
}

async function getRoleById(id){
    return await User.findById(id,'role');
}


async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function updateByUsername(username, userParam){
    const user = await User.findOne({username});

    if (!user) throw 'User not found';

    if (user.username != userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'New Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}