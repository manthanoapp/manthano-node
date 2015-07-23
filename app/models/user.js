/**
 * Created by enco on 29.5.15..
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    name           : {type: String, required: true},
    username       : {type: String, required: true, index: {unique: true}},
    // By setting select to false,
    // the password will not be returned when listing our users,
    // unless it is explicitly called.
    password       : {type: String, required: true, select: false},
    mail           : {type: String, required: true},
    surname        : {type: String, required: true},
    www            : String,
    profilePicture : String

});

// hash the password before user is saved
UserSchema.pre('save', function (next) {
    var user = this;

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the salt
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) return next(err);

        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

// return the models
module.exports = mongoose.model('User', UserSchema);