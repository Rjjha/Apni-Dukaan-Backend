const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:"Product",
    }],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"User",
    },
    status:{
        type:String,
        default:"not preocess",
        enum:["Not Process","Processing","Shipped","delivered","cancel"],
    }
},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema);