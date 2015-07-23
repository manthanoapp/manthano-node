/**
 * Created by stefan on 23.7.15..
 */
var express = require('express');
var User = require('../models/user');
var Activity = require('../models/activity');
var activityRouter = express.Router();

activityRouter.get('/',function(req, res){
    /**
     * Returns activities with users in it.
     *
     * Way for populating objectId references inside documents with actual objects.
     * .find().populate().exec();
     */
    Activity.find().populate('holders').exec(function(err, activities){
        res.json(activities);
    });
});

activityRouter.post('/',function(request, response){
    User.find({username:"steva"}, function(err, users){
        if(err)
         console.log("tup si;"+err);
        var ac = new Activity();
        // set information
        ac.name = "sssss";
        ac.description = "desc";
        ac.beginDate = "10-10-2012";
        ac.coverPicture = "cp";
        ac.active = false;
        var arr = new Array();
        users.forEach(function(user){
            arr.push(user._id);
        });
        ac.holders = arr;
        ac.save();
        response.send("jeb se2");
    });

});

module.exports = activityRouter;