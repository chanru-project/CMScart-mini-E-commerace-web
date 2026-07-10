const mongoose=require('mongoose');
const productSchema = new mongoose.Schema({
    cartItems:Array,
    amount:String,
    status:String,
    createdAt:Date 
})

const orderModel = mongoose.model('order',productSchema);

module.exports=orderModel;