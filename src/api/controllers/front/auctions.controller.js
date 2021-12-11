const moment = require('moment')
const NFT = require('../../models/nfts.model')
const UserModal = require('../../models/users.model');
const { globalImgPlaceholder } = require('../../../config/vars')

// API to get live auctions
exports.live = async (req, res, next) => {
    try {
        let { page, limit } = req.query

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const filter = {
            // sellingMethod: 2, // timed auctions only
            auctionStartDate: { $lt: new Date(moment().add(1, 'days').format('YYYY/MM/DD')) },
            auctionEndDate: { $gte: new Date(moment().format('YYYY/MM/DD')) }
        }

        const total = await NFT.countDocuments(filter)

        const auctions = await NFT.aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'ownerId',
                    as: 'owner'
                }
            },
            // {
            //     $unwind: '$owner'
            // },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    _id: 1, name: 1, image: 1, sold: 1, copies: 1, currentPrice: 1, auctionEndDate: 1,nftOwnerId:1,
                    owner: {
                        _id: '$owner._id',
                        username: '$owner.username',
                        profilePhoto: { $ifNull: ['$owner.profilePhoto', globalImgPlaceholder] }
                    }
                }
            }   
        ])
   
        return res.send({
            success: true, message: 'Live auctions retrieved successfully',
            data: {
                auctions,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}

