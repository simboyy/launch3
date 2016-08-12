'use strict';

var _ = require('lodash');
var Campaign = require('./campaign.model');
function isJson(str) {
  try {
      str = JSON.parse(str);
  } catch (e) {
      str = str;
  }
  return str
}

// Get all features group
exports.count = function(req, res) {
  if(req.query){
    var q = isJson(req.query.where);
    Campaign.find(q).count().exec(function (err, count) {
      if(err) { return handleError(res, err); }
      return res.status(200).json([{count:count}]);
    });
  }
};


// Get all campaigns by a user
exports.myCampaigns = function(req, res) {
function isJson(str) {
  try {
      str = JSON.parse(str);
  } catch (e) {
      str = str;
  }
  return str
}
  var q = isJson(req.query.where);

  //console.log(q);

  Campaign.find(q,function (err, campaigns) {


  	var total = 0;
  	
  	for (var i = 0; i < campaigns.length; i++) {
  		var item = campaigns[i];

  		  for (var j = 0; j < item.items.length; j++) {

                // items[i].total = 0;
              //console.log(item.items[j].status.name);
               var p = item.items[j].price;
               var q = item.items[j].quantity;
               total+=(p*q);
               
             }

             item.totalSpend = total;
             item.totalWeight = total;
             total = 0;
             //console.log(campaigns.totalWeight);

  	}
    if(err) { return handleError(res, err); }
    return res.status(200).json(campaigns);
  });
};

// Get all campaigns for a publisher
exports.pubCampaigns = function(req, res) {
	function isJson(str) {
  try {
      str = JSON.parse(str);
  } catch (e) {
      str = str;
  }
  return str
}
  var q = isJson(req.query.where);

  Campaign.find(q,function (err, campaigns) {

  		var total = 0;
  	
  	for (var i = 0; i < campaigns.length; i++) {
  		var item = campaigns[i];
  		  for (var j = 0; j < item.items.length; j++) {

                // items[i].total = 0;
              
               var p = item.items[j].price;
               var q = item.items[j].quantity;
               total+=(p*q);
               
             }

             item.totalSpend = total;
             item.totalWeight = total;
             total = 0;
             //console.log(campaigns.totalWeight);

  	}
    if(err) { return handleError(res, err); }
    return res.status(200).json(campaigns);
  });
};

// Get list of campaign
exports.index = function(req, res) {
  Campaign.find(function (err, campaigns) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(campaigns);
  });
};

// Get a single campaign
exports.show = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    return res.json(campaign);
  });
};

// Creates a new Campaign in the DB.
exports.create = function(req, res) {

  // console.log(req.body.items);
  req.body.uid = req.user.email; // id change on every login hence email is used
  var shortId = require('shortid');
  req.body.campaignNo = shortId.generate();
  req.body.status = {name:"New", val:201};
  Campaign.create(req.body, function(err, campaign) {

  	 
    if(err) { console.log(err);return handleError(res, err); }
    return res.status(201).json(campaign);
  });
};

// Updates an existing campaign in the DB.
exports.update = function(req, res) {
  

  if(req.body._id) { delete req.body._id; }
  if(req.body.__v) { delete req.body.__v; }
  // req.body.uid = req.user.email; // id change on every login hence email is used



  if(req.body.items){
  	
    
  req.body.updated = Date.now();
  Campaign.findById(req.params.id, function (err, campaign) {
    if (err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    var updated = _.merge(campaign, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(campaign);
    });
  });
}

else{
	

   Campaign.findById(req.params.id, function (err, campaign) {

    if (err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    campaign.items= [];
    campaign.items = req.body;
    campaign.items[0].uid = req.body.email;
    console.log(campaign);


   
    campaign.save(function (err) {
    			// create reusable transporter object using the default SMTP transport
		
      if (err) { return handleError(res, err); }
      return res.status(200).json(campaign);
    });
  });
}

};

// Updates an existing campaign in the DB.
exports.updateStatus = function(req, res) {
  // console.log(req.body._id);
  if(req.body._id) { delete req.body._id; }
  if(req.body.__v) { delete req.body.__v; }
  // req.body.uid = req.user.email; // id change on every login hence email is used
  // req.body.updated = Date.now();
  Campaign.findById(req.params.id, function (err, campaign) {

    if (err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
    campaign.items= [];

    for (var i = 0; i < campaign.items.length; i++) {
      campaign.items[i].price;
      //console.log(campaign.items[i].price);
    }


    campaign.items = req.body;
   
    campaign.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(campaign);
    });
  });
};

// Deletes a campaign from the DB.
exports.destroy = function(req, res) {
  Campaign.findById(req.params.id, function (err, campaign) {
    if(err) { return handleError(res, err); }
    if(!campaign) { return res.status(404).send('Not Found'); }
      campaign.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
