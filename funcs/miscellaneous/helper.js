/*
* Author : Djob Mvondo
* Miscellaneous helpers to achieve some tasks 
*/

loginImages = require('./images/list.json') //Update this file if you need to add new images

module.exports = {
	getLoginImage : () => {
		return loginImages[Math.floor(Math.random() * (loginImages.length-1))];
	}
}