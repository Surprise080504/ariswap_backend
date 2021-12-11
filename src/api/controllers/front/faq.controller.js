const FAQ = require('../../models/faq.model')

// API to get FAQ list
exports.list = async (req, res, next) => {
    try {
        const faqs = await FAQ.find({}, {title:1, desc: 1 })

        return res.send({
            success: true, message: 'FAQs fetched successfully',
            data: {
                faqs
            }
        })
    } catch (error) {
        return next(error)
    }
}