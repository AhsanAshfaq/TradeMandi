const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//monggose

// Define collection and schema
let User = new Schema({
    user_name: String,
    user_email: String,
    user_company_id: mongoose.Schema.Types.ObjectId,
    user_password: String,
    gender: String,
    dob: Date,
    user_phone: String,
    user_address: String
}, {
        collection: 'users'
    })

module.exports = mongoose.model('User', User)