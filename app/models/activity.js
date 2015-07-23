/**
 * Created by stefan on 23.7.15..
 */
/**
 * Created by enco on 29.5.15..
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ActivitySchema = new Schema({
    name: String,
    description : String,
    beginDate : Date,
    coverPicture : String,
    active : Boolean,
    holders: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


// return the models
module.exports = mongoose.model('Activity', ActivitySchema);