const ProductModel=require('../models/productModel');

function toPlainProduct(product) {
    if (!product || typeof product !== 'object') {
        return null;
    }

    const id = product._id ? String(product._id) : null;
    if (!id || !product.name) {
        return null;
    }

    return {
        ...product,
        _id: id
    };
}

function normalizeProducts(rawDocuments) {
    const normalized = [];

    for (const doc of rawDocuments) {
        const topLevelProduct = toPlainProduct(doc);
        if (topLevelProduct) {
            normalized.push(topLevelProduct);
        }

        if (Array.isArray(doc?.products)) {
            for (const nestedProduct of doc.products) {
                const plainNested = toPlainProduct(nestedProduct);
                if (plainNested) {
                    normalized.push(plainNested);
                }
            }
        }
    }

    return normalized;
}

// Get Product API-/api/v1/products
exports.getProducts = async (req, res, next) => {
    const keyword = (req.query.keyword || '').toString().trim().toLowerCase();

    const rawDocuments = await ProductModel.collection.find({}).toArray();
    const allProducts = normalizeProducts(rawDocuments);

    const products = keyword
        ? allProducts.filter((product) => product.name.toLowerCase().includes(keyword))
        : allProducts;

    res.json({
        success: true,
        products
    });
}

// Get Single Product API-/api/v1/product/:id
exports.getSingleProduct =async (req, res, next) => {
        try{
        const rawDocuments = await ProductModel.collection.find({}).toArray();
        const products = normalizeProducts(rawDocuments);
        const product = products.find((item) => item._id === req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Unable to get Product with that a ID'
            });
        }

    res.json({
        success: true,
        product
    })    

    }catch(error){
      
    res. status(404).json({
            success: false,
            message: 'Unable to get Product with that a ID'
        });
    }

}