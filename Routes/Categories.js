const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const Order = require('../Models/Order');
const Report = require('../Models/Report');
const authenticateToken = require('../MIddleware/Authentication');
router.get('/mobiles', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Mobiles' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      }); 
  });
  router.get('/electronic', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Electronic' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/health', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Health&Beauty' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/babyProduct', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'BabyProduct' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/fashion', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Fashion' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/kitchen', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Home&Kitchen' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/sports', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Sports&Outdoors' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/automotive', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Automotive' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/books', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Books' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/toys', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Toys&Games' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/groceries', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Groceries' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/furniture', authenticateToken, (req, res) => {
    Product.find({ ProductType: 'Furniture' })
      .then(products => {
        res.status(200).json({ products });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get('/search', async (req, res) => {
    try {
      const { productId, sellerId, keywords, fromDate, toDate } = req.query;
  
      const query = {};
  
      if (productId) {
        query.ProductID = Number(productId); 
      }
  
      if (sellerId) {
        query.sellerid = Number(sellerId); 
      }
  
      if (keywords) {
        query.Keyword = new RegExp(keywords, 'i'); 
      }
  
      if (fromDate || toDate) {
        query.createdDate = {};
  
        if (fromDate) {
          query.createdDate.$gte = new Date(fromDate);
        }
  
        if (toDate) {
          query.createdDate.$lte = new Date(toDate);
        }
      }
  
      const products = await Product.find(query);
      res.status(200).json(products);
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/ProductId', authenticateToken, (req, res) => {
    Product.find(req.params.ProductID)
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
  router.get('/ProductId/:ProductID', authenticateToken, (req, res) => {
    const productId = req.params.ProductID; 
  
    if (!productId) {
      return res.status(400).json({ error: 'ProductID parameter is required' });
    }
  
    Product.findOne({ ProductID: productId })
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
  router.get('/count', authenticateToken, async (req, res) => {
    try {
        const { email, userType } = req.user;
        const { OrderType } = req.query;  

        let filter = {};

        if (OrderType) {
            filter = { ...filter, OrderType }; 
        }

        if (userType === 'pmm') {
            filter.createdBy = email;
        }else if (userType === 'admin') {
          filter=OrderType;
      } else if (userType === 'pm') {
            filter.Orderedby = email;
        } else {
            filter.Orderedby = email;
        }

        const count = await Order.countDocuments(filter);

        res.status(200).json({ count });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});
router.get('/report/:reportID', authenticateToken, async (req, res) => {
  try {
      const { email, usertype } = req.user; 
      const { reportID } = req.params; 

      if (usertype === 'pmm') {
          const report = await Report.findOne({ ReportID: reportID, Createdby: email });
          if (!report) {
              return res.status(404).json({ error: 'Order not found or not authorized' });
          }
          res.status(200).json({ report });
      } else if (usertype === 'pmmmm') {
          const report = await Report.findOne({ ReportID: reportID, Orderedby: email });
          if (!report) {
              return res.status(404).json({ error: 'Order not found or not authorized' });
          }
          res.status(200).json({ report });
      } else {
          const report = await Report.findOne({ ReportID: reportID });
          if (!report) {
              return res.status(404).json({ error: 'Order not found or not authorized' });
          }
          res.status(200).json({ report });
      }
  } catch (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: err.message });
  }
});
router.get('/totalcommission', authenticateToken, async (req, res) => {
  try {
      const { email, usertype } = req.user; 
      let totalCommission = 0;

      if (usertype === 'pmm') {
          totalCommission = await Order.aggregate([
              { $match: { Createdby: email, OrderType: 'refunded' } },
              { $group: { _id: null, total: { $sum: "$totalCommission" } } }
          ]);
      } else if (usertype === 'pm') {
          totalCommission = await Order.aggregate([
              { $match: { Orderedby: email, OrderType: 'refunded' } },
              { $group: { _id: null, total: { $sum: "$totalCommission" } } }
          ]);
      } else {
          totalCommission = await Order.aggregate([
              { $group: { _id: null, total: { $sum: "$totalCommission" } } }
          ]);
      }

      const subtotal = totalCommission.length > 0 ? totalCommission[0].total : 0;
      res.status(200).json({ subtotal });
      
  } catch (err) {
      console.error('Error fetching total commission:', err);
      res.status(500).json({ error: err.message });
  }
});
  module.exports = router;
