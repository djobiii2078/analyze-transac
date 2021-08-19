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
const School = db.School;

module.exports = {
    getAll,
    getAllRegion,
    getAllRegionDept,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await School.find();
}

async function getById(id) {
    return await School.findById(id);
}

async function getAllRegion(region){
    return await School.find({ region: region });

}

async function getAllRegionDept(region,dept){
    return await School.find({ region: region, department: department })
}

//TODO: Get the schools within a certain perimeter e.g., 10KM^2 from a fixed point

async function create(schoolParam) {
    // validate
    if (await School.findOne({ name: schoolParam.name })) {
        throw 'School name "' + schoolParam.name + '" already exists';
    }

    const school = new School(schoolParam);

    // hash password
    

    // save user
    await school.save();
}

async function update(id, schoolParam) {
    const school = await School.findById(id);

    // validate
    if (!school) throw 'User not found';
    

    // copy userParam properties to user
    Object.assign(school, schoolParam);

    await school.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}