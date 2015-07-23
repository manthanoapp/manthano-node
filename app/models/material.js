var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MaterialSchema = new Schema({
    name         : String,
    URI          : String,
    date         : Date,
    type         : String,
    owner        : {type:mongoose.Schema.Types.ObjectId, ref:'User'}
});


// return the models
module.exports = mongoose.model('Material', MaterialSchema);
