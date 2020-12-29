const mongoose = require("mongoose")
const Schema = mongoose.Schema ;    //schema object

const memoriesSchema = new Schema({
    title : String ,
    // author : String ,   
    date : Date,
    
})

const Memory = mongoose.model('memory', memoriesSchema) ;   //create a model and its collection(all lowercase) from the above schema
module.exports = Memory ;