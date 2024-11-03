const cron = require('node-cron');
const Product = require('./Models/Product');

cron.schedule('0 0 * * *', async () => {
    try {
        const products = await Product.find({});

        for (const product of products) {
            const newTodayRemaining = Math.min(product.SaleLimit, product.TotalRemaining);

            const newTotalRemaining = Math.max(product.TotalRemaining - product.SaleLimit, 0);

            await Product.findByIdAndUpdate(product._id, {
                TodayRemaining: newTodayRemaining,
                TotalRemaining: newTotalRemaining,
            });
        }

        console.log('Daily reset of TodayRemaining and adjustment of TotalRemaining completed.');
    } catch (error) {
        console.error('Error resetting daily limits:', error);
    }
});
