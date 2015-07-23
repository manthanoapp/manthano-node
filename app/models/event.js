var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EventSchema = new Schema({
    name         : String,
    description  : String,
    date         : Date,
    venue        : String,
    //TODO: Unique values!
    holders      : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    materials    : [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}]
});


// return the models
module.exports = mongoose.model('Event', EventSchema);
