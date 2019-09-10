'use strict';
const mongoose = require("mongoose");

//A user has 5 different fields
// - _id: Schema.Types.ObjectId (generated automatically)
// - username
// - password
// - createdAt: Date (generated automatically thanks to 'timestamps:true')
// - updatedAt: Date (generated automatically thanks to 'timestamps:true')
const userSchema = new mongoose.Schema({
  username: {
    type:String, 
    required:true, 
    unique:true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true //Option
});


module.exports = mongoose.model("User", userSchema);