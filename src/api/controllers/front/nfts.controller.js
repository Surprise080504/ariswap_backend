const fs = require("fs");
const moment = require("moment");
const User = require("../../models/users.model");
const NFT = require("../../models/nfts.model");
const { addImage, addContent } = require("../../utils/upload");
const ObjectId = require("mongoose").Types.ObjectId;
const {
  userDefaultImage,
  collectionDefaultImage,
} = require("../../../config/vars");

// API to create NFT
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.image) {
      const image = req.files.image[0];
      const imgData = fs.readFileSync(image.path);
      payload.image = await addImage(imgData);
    }

    payload.metaData = await addContent({
      name: payload.name,
      description: payload.description,
      image: payload.image,
      properties: {
        size: payload.size || "",
      },
      nftOwnerId: payload.nftOwnerId,
      ownerAddress: payload.ownerAddress,
    });

    payload.ownerId = req.user;
    payload.creatorId = req.user;
    // console.log(payload, "payload to create nft");

    const nft = await NFT.create(payload);
    //console.log(nft,"created Nft==>")
    return res.send({
      success: true,
      message: "Item created successfully",
      nft,
    });
  } catch (error) {
    console.log("upload error: ", error);
    return next(error);
  }
};

// API to edit NFT
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files && req.files.image) {
      const image = req.files.image[0];
      const imgData = fs.readFileSync(image.path);
      payload.image = await addImage(imgData);
    }

    // set NFT selling config.
    if (payload.sellingMethod && payload.sellingConfig) {
      payload.sellingConfig = JSON.parse(payload.sellingConfig);

      // set auction start & end date-time
      const datetimeKey =
        Number(payload.sellingMethod) === 1 ? "listingSchedule" : "duration";
      payload.auctionStartDate = payload.sellingConfig[datetimeKey]?.startDate;
      payload.auctionEndDate = payload.sellingConfig[datetimeKey]?.endDate;
      payload.auctionStartTime = payload.sellingConfig[datetimeKey]?.startTime;
      payload.auctionEndTime = payload.sellingConfig[datetimeKey]?.endTime;
    }

    const nft = await NFT.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "NFT updated successfully",
      nft,
    });
  } catch (error) {
    return next(error);
  }
};

// API to edit status NFT
exports.update = async (req, res, next) => {
  try {
    let payload = req.body;

    // set NFT selling config.

    const nft = await NFT.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );
    // console.log("nft after update");
    return res.send({
      success: false,
      message: "Sorry! You rejected wallet processing",
      nft,
    });
  } catch (error) {
    return next(error);
  }
};
// API to get a NFT
exports.get = async (req, res, next) => {
  try {
    const { nftId } = req.params;
    let wholeData = await NFT.findOne({ _id: nftId });
    // console.log(wholeData,"testNft===>data")
    const nft = await NFT.aggregate([
      {
        $match: { _id: ObjectId(nftId) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "creatorId",
          as: "creator",
        },
      },
      // {
      //     $unwind: '$creator'
      // },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "ownerId",
          as: "owner",
        },
      },
      // {
      //     $unwind: '$owner'
      // },
      {
        $lookup: {
          from: "collections",
          foreignField: "_id",
          localField: "collectionId",
          as: "collection",
        },
      },
      {
        $unwind: "$collection",
      },
      // {collection
      //         from: 'bids',
      //         foreignField: 'nftId',
      //         localField: '_id',
      //         as: 'bids'
      //     }
      // },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          createdAt: 1,
          sellingMethod: 1,
          nftOwnerId: 1,
          size: { $ifNull: ["$size", "N/A"] },
          sold: 1,
          copies: 1,
          currentPrice: 1,
          auctionEndDate: 1,
          // creator: {
          //     _id: '$creator._id',
          //     username: '$creator.username',
          //     profilePhoto: { $ifNull: ['$creator.profilePhoto', userDefaultImage] }
          // },
          // owner: {
          //     _id: '$owner._id',
          //     username: '$owner.username',
          //     profilePhoto: { $ifNull: ['$owner.profilePhoto', userDefaultImage] }
          // },
          collection: {
            _id: "$collection._id",
            name: "$collection.name",
            image: {
              $ifNull: ["$collection.featuredImg", collectionDefaultImage],
            },
            userId: "$collection.userId",
          },
          // highestBidAmt: { $max: '$bids.price.amount' }
        },
      },
    ]);

    // console.log(nft,"it's the retrieved nft")

    return res.send({
      success: true,
      message: "Item retrieved successfully",
      nft: nft.length ? nft[0] : null,
      allData: wholeData,
    });
  } catch (error) {
    // console.log(error,"error==>")
    return next(error);
  }
};

// API to get NFTs list
exports.list = async (req, res, next) => {
  try {
    let { page, limit, collectionId, explore } = req.query;
    // console.log(explore,"explore==>")
    const userId = req.user;
    let filter = {
      status: { $ne: 0 },
    };

    // get NFTs for given collection
    if (collectionId) filter.collectionId = ObjectId(collectionId);

    // COMMENTED TEMP.
    // explore exclusive assets
    // if (explore) {
    //     filter = {
    //         $or: [
    //             { creatorId: ObjectId(userId) },
    //             {
    //                 $or: [
    //                     { sellingMethod: 1 },
    //                     { sellingMethod: 2 }
    //                 ],
    //                 auctionStartDate: { $lt: new Date(moment().add(1, 'days').format('YYYY/MM/DD')) },
    //                 auctionEndDate: { $gte: new Date(moment().format('YYYY/MM/DD')) }
    //             }
    //         ]
    //     }
    // }

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    const total = await NFT.countDocuments(filter);

    const nfts = await NFT.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "ownerId",
          as: "owner",
        },
      },
      // {
      //     $unwind: '$owner'
      // },
      {
        $project: {
          name: 1,
          image: 1,
          sold: 1,
          copies: 1,
          currentPrice: 1,
          collectionId: 1,
          currentPrice: 1,
          description: 1,
          royalty: 1,
          size: 1,
          userId,
          owner: {
            _id: "$owner._id",
            username: "$owner.username",
            profilePhoto: {
              $ifNull: ["$owner.profilePhoto", userDefaultImage],
            },
          },
        },
      },
    ]);
    const wholeData = await NFT.find({
      status: { $ne: 0 },
    });

    // console.log(wholeData,"nfts fetched ");
    // nfts.push(wholeData)
    return res.send({
      success: true,
      message: "NFTs fetched successfully",
      data: {
        nfts: wholeData,
        allData: wholeData,
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

exports.editNft = async (req, res, next) => {
  try {
    const filter = { _id: req.body.nftOwnerId };
    // console.log(req.body.currentUserId, "req.body.currentUserId");
    // console.log(req.body.ownerId, "req.body.ownerId");
    let update = {
      nftOwnerId: req.body.currentUserId,
    };
    const updatedNft = await NFT.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).send({
      status: "success",
      data: updatedNft,
    });
  } catch (err) {
    //  console.log(err,"error of ownerShip===>")
    // res.status(400).send({
    //     status:"failure",
    //     err
    // })
    return next(error);
  }
};

exports.myNFT = async (req, res, next) => {
  try {
    const celoPunkMetaData = req.body.celoPunkMetaData;
    const userId = req.body.userId;
    const ownerAddress = req.body.ownerAddress;
    await NFT.deleteMany({ nftOwnerId: userId, type: "CELO_PUNK" });
    for await (let item of celoPunkMetaData) {
      await NFT.create({
        name: item.data.name,
        description: item.data.description,
        ownerId: userId,
        nftOwnerId: userId,
        userId: userId,
        ownerAddress,
        image: item.data.image,
        metaData: item.tokenUri, // ipfs link
        type: "CELO_PUNK",
      });
    }

    const myData = await NFT.find({
      status: { $ne: 0 },
      nftOwnerId: userId,
    });

    // console.log(wholeData,"nfts fetched ");
    // nfts.push(wholeData)
    return res.send({
      success: true,
      message: "MyNFTs fetched successfully",
      data: {
        nfts: myData,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.deletePunks = async (req, res, next) => {
  await NFT.deleteMany({ type: "CELO_PUNK" });
};
