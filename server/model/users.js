const mongoose = require('mongoose')
const Schema = mongoose.Schema
//userSchema format for user database:
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    key: { type: String, required: true }
},
    { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)