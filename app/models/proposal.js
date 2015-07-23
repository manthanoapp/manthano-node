var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProposalSchema = new Schema({
    name         : String,
    description  : String,
    beginDate    : Date,
    userProposed : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    active       : Boolean,
    //TODO: Unique values!
    holders      : [{ proposed: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, propose : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
    supporters   : [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


// return the models
module.exports = mongoose.model('Proposal', ProposalSchema);