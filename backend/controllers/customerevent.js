const CustomerEvent = require("../models/customerevent");

exports.createEvent = (req,res,next) => {
  var customerEvent = new CustomerEvent(req.body);
  customerEvent.creator = req.userData.userId;
  customerEvent.save().then(result =>{
    res.status(201).json({
      message: 'Event Added Successfully',
      postId: result._id
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Failed to create event!'
    })
  });
}

exports.updateEvent = (req,res,next) => {
  var customerEvent = new CustomerEvent(req.body);
  CustomerEvent.updateOne({_id: req.params.id, creator: req.userData.userId }, customerEvent).then(result =>{
    if(result.n> 0 ){
      res.status(200).json({message: "Update Successful!"});
    }
    else {
      res.status(200).json({message: "Event not found!"});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Failed to update post!"
    })
  });
}

exports.deleteEvent = (req,res,next) => {
  CustomerEvent.deleteOne({_id: req.params.id, creator: req.userData.userId }).then( result => {
    if(result.n > 0 ){
      res.status(200).json({message: "Delete Successful!"});
    }
    else {
      res.status(200).json({message: "Event not found!"});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Failed to delete post!"
    })
  })
}

exports.getEvent = (req,res,next)=>{
  CustomerEvent.find({creator: req.params.id}).then(documents => {
    res.status(200).json({
      events : documents,
    });
  })
  .catch(error =>{
    res.status(500).json({
      message: "Failed to fetch events!"
    })
  });
}
