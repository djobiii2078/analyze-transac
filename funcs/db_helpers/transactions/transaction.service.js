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
const Transactions = db.Transaction;

module.exports = {
    getAll,
    getById,
    getBySchoolIds,
    create,
    delete: _delete
};


/**
 * @TODO: Limit the transaction return to 1000
 * But not sure it is the right way to ensure scalability
 * Need more thought on this 
 */
async function getAll() {
    return await Transactions.find();
}

async function getById(id) {
    return await Transactions.findById(id);
}

async function getBySchoolIds(ids){
    return await Transactions.find({ schoolid : {$in : ids}});

}

async function create(transaction) {
    // validate
   
    const transaction = new School(schoolParam);

    // hash password
    

    // save user
    await transaction.save();
}

/**
 * @NOTICE:  Not sure this is a useful API
 * Any way, let's just write it
 */
async function update(id, transactionParam) {
    const transaction = await transaction.findById(id);

    // validate
    if (!transaction) throw 'Transaction not found';
    

    // copy userParam properties to user
    transaction.assign(school, schoolParam);

    await transaction.save();
}

async function _delete(id) {
    await Transaction.findByIdAndRemove(id);
}