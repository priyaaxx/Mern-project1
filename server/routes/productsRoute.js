const router = require('express').Router();
const Product = require('../models/productModel');
const authMiddleware = require('../middlewares/authMiddleware');
const { cloudinary } = require("../config/cloudinaryConfig");
const multer = require("multer");

// Add a new product
router.post('/add-product', authMiddleware, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.send({
            success: true,
            message: "Product added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


// Get all products

router.post('/get-products', async (req, res) => {
    try {
        const {
            seller,
            category = [],
            age = [],
            material = [],
            color = [],
            itemType = [],
            status,
            searchQuery
        } = req.body;

        // Build filters based on request parameters
        let filters = {};

        if (seller) {
            filters.seller = seller;
        }
        if (status) {
            filters.status = status;
        }
        if (category.length > 0) {
            filters.category = { $in: category };
        } 
        if (age.length > 0) {
            age.forEach((item)=>{
                if(item === "5+"){
                    const fromAge = 5;
                    filters.age = {$gte: fromAge};
                } else{
                const fromAge = item.split("-")[0];
                const toAge = item.split("-")[1];
                filters.age = {$gte: fromAge, $lte: toAge};
                }
            });
          }
        if (material.length > 0) {
            filters.material = { $in: material };
        }
        if (color.length > 0) {
            filters.color = { $in: color };
        }
        if (itemType.length > 0) {
            filters.itemType = { $in: itemType };
        }
        if (searchQuery) {
            filters.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
          }

        const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });

        res.send({
            success: true,
            data: products,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});



// Edit a product
router.put('/edit/product/:id', authMiddleware, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.send({
                success: false,
                message: "Product not found",
            });
        }
        res.send({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


//get a product by id
router.get("/get-product-by-id/:id", async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product,
        });
    } catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Delete a product
router.delete('/delete-product/:id', authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});


const storage = multer.diskStorage({
    filename: function (req, file, callback) {
      callback(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/upload-product-image', authMiddleware, upload.single('file'), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "thriftit",
      });
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });
      res.send({
        success: true,
        message: "Image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).send({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  });

  //update product status
  router.put("/update-product-status/:id", authMiddleware, async(req, res)=>{
    try{
        const { status } = req.body;
        await Product.findByIdAndUpdate(req.params.id, {status});
        res.send({
            success: true,
            message: "Product status updated successfully",
        });
    } catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
  });
  
  module.exports = router;