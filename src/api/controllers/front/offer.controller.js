const fs = require("fs");
const moment = require("moment");
const NFT = require("../../models/nfts.model");
const Offer = require("../../models/offer.model");
const ObjectId = require("mongoose").Types.ObjectId;
const { globalImgPlaceholder } = require("../../../config/vars");

// API to create offer
exports.create = async (req, res, next) => {
  // console.log("in the create offer get function===>")
  try {
    let payload = req.body;
    payload.offerBy = req.user;
    // console.log(payload,"payload created in the offer8888888888888888==>")
    const offer = await Offer.create(payload);
    // console.log(offer,"offer created in the offer999999999999999999999==>")
    return res.send({
      success: true,
      message: "You have made offer successfully",
      offer,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete offer
exports.delete = async (req, res, next) => {
  try {
    const { offerId } = req.params;
    if (offerId) {
      const offer = await Offer.deleteOne({ _id: offerId });
      if (offer && offer.deletedCount)
        return res.send({
          success: true,
          message: "Your Offer has been cancelled successfully",
        });
      else
        return res
          .status(400)
          .send({ success: false, message: "Offer not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Offer Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get offers list
exports.list = async (req, res, next) => {
  try {
    let { page, limit, nftId } = req.query;
    let filter = { isExpired: false, isAccepted: false };

    if (nftId) filter.nftId = ObjectId(nftId);

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await Offer.countDocuments(filter);
    const allOffers = await Offer.find();
    // console.log(allOffers,"allOffers==")

    const offers = await Offer.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "offerBy",
          as: "offerBy",
        },
      },
      {
        $unwind: "$offerBy",
      },
      {
        $project: {
          offerBy: {
            _id: "$offerBy._id",
            username: "$offerBy.username",
            profilePhoto: {
              $ifNull: ["$offerBy.profilePhoto", globalImgPlaceholder],
            },
          },
          price: 1,
          expiryDate: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.send({
      success: true,
      message: "Offers fetched successfully",
      data: {
        offers: allOffers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

// API to accept offer
exports.accept = async (req, res, next) => {
  try {
    const { offerId } = req.body;

    if (offerId) {
      // accept offer
      const offer = await Offer.findByIdAndUpdate(
        { _id: offerId },
        { isAccepted: true },
        { new: true }
      );

      if (offer) {
        // expire other offers
        await Offer.updateMany(
          { _id: { $ne: ObjectId(offerId) }, nftId: offer.nftId },
          { $set: { isExpired: true } }
        );

        await NFT.updateOne(
          { _id: offer.nftId },
          {
            $unset: {
              sellingMethod: undefined,
              sellingConfig: undefined,
              auctionEndDate: undefined,
              auctionEndTime: undefined,
              auctionStartDate: undefined,
              auctionStartTime: undefined,
            },
            $set: {
              ownerId: offer.offerBy,
            },
          }
        );

        return res.send({
          success: true,
          message: "Offer has been accepted successfully",
        });
      } else
        return res
          .status(400)
          .send({ success: false, message: "Offer not found for given Id" });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Offer Id is required" });
  } catch (error) {
    return next(error);
  }
};
