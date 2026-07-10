const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

exports.createOrder =async (req,res,next) => {
    // console.log(req.body,'DATA');
    //create Order-/api/v1/order
    const cartItems = Array.isArray(req.body)
        ? req.body
        : (Array.isArray(req.body?.cartItems) ? req.body.cartItems : []);

    if (cartItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Cart items are required'
        });
    }

    const amount = Number(
        cartItems.reduce((acc, item) => acc + (Number(item.product.price) * Number(item.qty)), 0)
    ).toFixed(2);
    //  console.log(amount,'AMOUNT');
    const status='pending';

    const order=await orderModel.create({cartItems,amount,status})

    for (const item of cartItems) {
        const rawProductId = item?.product?._id || item?.product;
        const productId = typeof rawProductId === 'string'
            ? rawProductId
            : (typeof rawProductId?.$oid === 'string' ? rawProductId.$oid : null);

        if (!productId) {
            continue;
        }

        await productModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: -Number(item.qty) } },
            { new: true }
        );
    }

    res.json({
        success:true,
        order
    })
}