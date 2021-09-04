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
const Transac_record = db.Transac_record;
const schoolService = require('../schools/school.service');
module.exports = {
    getAll,
    getById,
    getBySchoolIds,
    create,
    getAllRecords,
    getCount,
    create_record,
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

async function getAllRecords(operator){
    return await Transac_record.find({operator: operator});
}

/**
 * 
 */

 async function getCount(operator) {
    return await Transactions.aggregate([{$match: {$and: [{operator:operator}]}},{$group:{_id: null, sum: {$sum: "$value"}}}]);
 }

async function getById(id) {
    return await Transactions.findById(id);
}

async function getBySchoolIds(ids){
    return await Transactions.find({ schoolid : {$in : ids}});

}

async function create(transaction,session) {
    // validate
   //Get the region and department name from the schoolname 
    schoolService.getRegionDept(transaction.schoolname)
    .then(async (paramsSchool) => {
        //console.log(JSON.parse(JSON.stringify(paramsSchool[0]));
         transaction['region'] = JSON.parse(JSON.stringify(paramsSchool[0])).region;
         transaction['department'] = JSON.parse(JSON.stringify(paramsSchool[0])).department;

    console.log(transaction);

    //@TODO: Check if school doesn't exists

    const transac = new Transactions(transaction);


    // hash password
    
    // save user
  //  await transac.save({session});
    await transac.save();
});

   
}

async function create_record(transac_record){
    const transac_records = new Transac_record(transac_record);

    await transac_records.save();
}

/**
 * @NOTICE:  Not sure this is a useful API
 * Any way, let's just write it
 */
async function update(id, transactionParam) {
    const transaction = await Transactions.findById(id);

    // validate
    if (!transaction) throw 'Transaction not found';
    

    // copy userParam properties to user
    transaction.assign(transaction, transactionParam);

    await transaction.save();
}

async function _delete(id) {
    await Transaction.findByIdAndRemove(id);
}