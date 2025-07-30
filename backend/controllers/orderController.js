const orderModel = require('../models/orderModel');
exports.createOrder =async (req,res,next) => {
    // console.log(req.body,'DATA');
    //create Order-/api/v1/order
    const cardItems = req.body;
    const amount = Number((cardItems.reduce((acc,item)=> (item.product.price*item.qty), 0))).toFixed(2);
    //  console.log(amount,'AMOUNT');
    const status='pending';

    const order=await orderModel.create({cardItems,amount,status})
    res.json({
        success:true,
        order
    })
}