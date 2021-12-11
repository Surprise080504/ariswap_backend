const Category = require('../../models/categories.model')

// API to get active categories list
exports.list = async (req, res, next) => {
    try {
        const categories = await Category.find({ status: true }, { name: 1, image: 1 }).sort({ name: 1 })

        return res.send({ success: true, message: 'Categories fetched successfully', categories })
    } catch (error) {
        return next(error)
    }
}