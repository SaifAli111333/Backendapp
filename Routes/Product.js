const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const mongoose = require('mongoose');
const authenticateToken = require('../MIddleware/Authentication');
const getNextSequenceValue =require('../Models/getNextSequenceValue')

router.post('/', authenticateToken, async (req, res) => {
  try {
    const nextId = await getNextSequenceValue('productId');

    const totalCommission = 
      (parseFloat(req.body.TextReview) || 0) +
      (parseFloat(req.body.PictureReview) || 0) +
      (parseFloat(req.body.VedioReview) || 0) +
      (parseFloat(req.body.TextTopReview) || 0) +
      (parseFloat(req.body.PictureTopReview) || 0) +
      (parseFloat(req.body.VedioTopReview) || 0) +
      (parseFloat(req.body.Rating) || 0) +
      (parseFloat(req.body.NoReview) || 0) +
      (parseFloat(req.body.Feedback) || 0) +
      (parseFloat(req.body.Giveaway) || 0);

    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      ProductID: nextId,
      ProductType: req.body.ProductType,
      Market: req.body.Market,
      SaleLimit: req.body.SaleLimit,
      TodayRemaining: req.body.TodayRemaining,
      TotalRemaining: req.body.TotalRemaining,
      Keyword: req.body.Keyword,
      ASIN: req.body.ASIN,
      SoldBy: req.body.SoldBy,
      Brandname: req.body.Brandname,
      ProductPrice: req.body.ProductPrice,
      ComissionType: req.body.ComissionType,
      TextReview: parseFloat(req.body.TextReview) || 0,
      PictureReview: parseFloat(req.body.PictureReview) || 0,
      VedioReview: parseFloat(req.body.VedioReview) || 0,
      TextTopReview: parseFloat(req.body.TextTopReview) || 0,
      PictureTopReview: parseFloat(req.body.PictureTopReview) || 0,
      VedioTopReview: parseFloat(req.body.VedioTopReview) || 0,
      Rating: parseFloat(req.body.Rating) || 0,
      NoReview: parseFloat(req.body.NoReview) || 0,
      Feedback: parseFloat(req.body.Feedback) || 0,
      Giveaway: parseFloat(req.body.Giveaway) || 0,
      totalCommission: totalCommission, 
      createdBy: req.user.email,
      sellerid: req.user.user_id
    });

    const result = await newProduct.save();
    res.status(201).json({
      result: result
    });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/:id', authenticateToken, (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json({  
          product: product
        });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});
router.get('/', authenticateToken, (req, res) => {
  if (req.user.usertype === 'pmm') {
    Product.find({ createdBy: req.user.email })
      .then(products => {
        res.status(200).json({
          products: products
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err.message
        });
      });
  } else {
    Product.find()
      .then(products => {
        res.status(200).json({
          products: products
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err.message
        });
      });
  }
});
router.delete('/:id', authenticateToken, (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        if (product.createdBy === req.user.email || req.user.usertype === 'admin') {
          return Product.findByIdAndDelete(req.params.id);
        } else {
          throw new Error('Forbidden: You can only delete your own products');
        }
      } else {
        throw new Error('Product not found');
      }
    })
    .then(() => {
      res.status(200).json({
        message: 'Product deleted'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});
router.put('/:id', authenticateToken, (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        if (product.createdBy === req.user.email || req.user.usertype === 'admin') {
          return Product.updateOne(
            { _id: req.params.id },
            {
              $set: req.body
            }
          );
        } else {
          throw new Error('Forbidden: You can only update your own products');
        }
      } else {
        throw new Error('Product not found');
      }
    })
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      });
    });
});
router.get('/mobiles', authenticateToken, (req, res) => {
  Product.find({ ProductType: 'Mobiles' })
    .then(products => {
      res.status(200).json({ products });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
module.exports = router;
