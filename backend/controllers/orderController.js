const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.createOrder =async (req,res,next) => {
    // console.log(req.body,'DATA');
    //create Order-/api/v1/order
    const cardItems = req.body;
    const amount = Number((cardItems.reduce((acc,item)=> (item.product.price*item.qty), 0))).toFixed(2);
    //  console.log(amount,'AMOUNT');
    const status='pending';

    const order=await orderModel.create({cardItems,amount,status})

    for (const item of cartItems) {
    const productId = item.product._id || item.product; // handle both cases
    const result = await productModel.findByIdAndUpdate(
        productId,
        { $inc: { stock: -item.qty } },
        { new: true }
    );
    console.log("Updated product:", result);
}

    res.json({
        success:true,
        order
    })
}