const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title : {type: String, required: true},
  address : {type: String},
  start: {type: Date},
  end: {type:Date},
  allDay: {type: Boolean},
  details: {type: String},
  resizable: {
    beforeStart: {type: Boolean},
    afterEnd: {type: Boolean},
},
  draggable: {type: Boolean},
  placeId: {type: String},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true}
});

module.exports = mongoose.model('CustomerEvent', eventSchema);
