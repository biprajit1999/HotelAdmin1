var mongoose = require('mongoose');
var Schema = mongoose.Schema;

adminSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	username: String,
	password: String,
	passwordConf: String
}),
Admin = mongoose.model('admin', adminSchema,'admin');

module.exports = Admin;