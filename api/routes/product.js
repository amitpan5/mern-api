const express = require('express');
const routes = express.Router();
const product = require('../model/product'); // Correct import
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload'); // Add file upload middleware

// Middleware for file uploads
routes.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dsw65jbrq',
    api_key: '732411392813237',
    api_secret: 'lriJ7I-eF-nsz5yEYKaMaglXqUI'
});

// Get all products
routes.get('/', checkAuth, (req, res) => {
    product.find()
        .then(result => {
            res.status(200).json({
                message: 'Products fetched successfully',
                productData: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

// Get product by ID
routes.get('/:id', (req, res) => {
    product.findById(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ product: result });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

// Add a new product
routes.post('/', (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).json({ message: 'Photo file is required' });
    }

    const file = req.files.photo;

    // Upload file to Cloudinary
    cloudinary.uploader.upload(file.tempFilePath, (err, uploadResult) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }

        // Create a new product
        const newProduct = new product({
            _id: new mongoose.Types.ObjectId(),
            code: req.body.code,
            title: req.body.title,
            description: req.body.description,
            mrp: req.body.mrp,
            sp: req.body.sp,
            discountPercent: req.body.discountPercent,
            imagePath: uploadResult.url // Save the Cloudinary URL
        });

        newProduct.save()
            .then(result => {
                res.status(201).json({
                    message: 'Product created successfully',
                    newProduct: result
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: err.message });
            });
    });
});

// Delete a product by ID
routes.delete('/:id', (req, res) => {
    product.deleteOne({ _id: req.params.id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

// Update a product by ID
routes.put('/:id', (req, res) => {
    product.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                code: req.body.code,
                title: req.body.title,
                description: req.body.description,
                mrp: req.body.mrp,
                sp: req.body.sp,
                discountPercent: req.body.discountPercent,
                imagePath: req.body.imagePath
            }
        },
        { new: true } // Return the updated document
    )
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({
                message: 'Product updated successfully',
                updatedProduct: result
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message });
        });
});

module.exports = routes;
