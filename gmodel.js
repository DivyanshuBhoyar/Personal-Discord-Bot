const mongoose = require("mongoose")
const Schema = mongoose.Schema ;    //schema object

const gaaliSchema = new Schema({
    name : String ,
     
   
    
})

const Gaali = mongoose.model('gaali', gaaliSchema) ;   //create a model and its collection(all lowercase) from the above schema
module.exports = Gaali ;