const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const NFT = require("../../models/nfts.model");
const Collection = require("../../models/collection.model");
const { addImage } = require("../../utils/upload");
const { checkDuplicate } = require("../../../config/errors");
const { collectionDefaultImage } = require("../../../config/vars");

// API to create collection
exports.create = async (req, res, next) => {
  try {
    // let payload = req.body
    // console.log(req.body,"req.body")

    let payload = {
      userId: req.body.userId,
      categoryId: req.body.categoryId,
      name: req.body.name,
      url: req.body.url,
      logo: req.body.logoUrl,
      featuredImg: req.body.featuredImgUrl,
      banner: req.body.bannerUrl,
      description: req.body.description,
    };
    // console.log(payload,"payload")
    if (req.files)
      for (const key in req.files) {
        const image = req.files[key][0];
        const imgData = fs.readFileSync(image.path);
        payload[key] = await addImage(imgData);
      }

    if (!payload.userId || !payload.name || !payload.logo) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // check user existing collection
    const existingCollection = await Collection.findOne({
      name: new RegExp(payload.name, "gi"),
      userId: payload.userId,
    });

    if (existingCollection) {
      return res.status(400).send({
        success: false,
        message: "Collection with same name already exists",
      });
    }

    // console.log("reached on collection")
    const collection = await Collection.create(payload);
    // console.log(collection,"collection==========>")
    return res.status(200).send({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    // console.log(error,"error in the api")
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Collection");
    else return next(error);
  }
};

// API to edit collection
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.files)
      for (const key in req.files) {
        const image = req.files[key][0];
        const imgData = fs.readFileSync(image.path);
        payload[key] = await addImage(imgData);
      }

    // TEMP appending userId
    payload.userId = "61408000cef27850fdea272b";

    if (!payload._id || !payload.userId)
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields",
      });

    // if name is given then check user existing collection
    if (payload.name) {
      const existingCollection = await Collection.findOne({
        _id: { $ne: payload._id },
        name: new RegExp(payload.name, "gi"),
        userId: payload.userId,
      });

      if (existingCollection)
        return res.status(400).send({
          success: false,
          message: "Collection with same name already exists",
        });
    }

    const collection = await Collection.findByIdAndUpdate(
      { _id: payload._id },
      { $set: payload },
      { new: true }
    );
    return res.send({
      success: true,
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, "Collection");
    else return next(error);
  }
};

// API to delete collection
exports.delete = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    if (collectionId) {
      const collection = await Collection.deleteOne({ _id: collectionId });
      if (collection.deletedCount)
        return res.send({
          success: true,
          message: "Collection deleted successfully",
          collectionId,
        });
      else
        return res.status(400).send({
          success: false,
          message: "Collection not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Collection Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get collection
exports.get = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    if (collectionId) {
      let collection = await Collection.findOne(
        { _id: collectionId },
        { __v: 0, createdAt: 0, updatedAt: 0 }
      )
        .populate([
          { path: "userId", select: "_id username email profilePhoto" },
          { path: "categoryId", select: "_id name image" },
        ])
        .lean(true);
      if (collection) {
        collection.user = collection.userId;
        collection.category = collection.categoryId;

        delete collection.userId;
        delete collection.categoryId;

        collection.items = await NFT.countDocuments({ collectionId });

        let owners = await NFT.find({ collectionId }).distinct("collectionId");
        collection.owners = owners?.length || 0;

        return res.json({
          success: true,
          message: "Collection retrieved successfully",
          collection,
        });
      } else
        return res.status(400).send({
          success: false,
          message: "Collection not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "Collection Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get collection list
exports.list = async (req, res, next) => {
  try {
    let { page, limit, categoryId, all, userId } = req.query;
    // console.log(userId,"userId===>")
    // let userId = req.user
    // console.log("userId------@", userId);
    // console.log("category------@", req.categoryId)
    // if (!userId)
    //     return res.status(400).send({ success: false, message: 'Please Sign In First' })

    const filter = {};

    // if (userId)
    //     filter.userId = ObjectId(userId)

    if (categoryId) filter.categoryId = ObjectId(categoryId);

    let total = 0;

    if (!all) {
      page = page !== undefined && page !== "" ? parseInt(page) : 1;
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

      total = await Collection.countDocuments(filter);

      if (page > Math.ceil(total / limit) && total > 0)
        page = Math.ceil(total / limit);
    }

    const pipeline = [
      {
        $match: filter,
      },
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "categoryId",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          userId: 1,
          featuredImg: { $ifNull: ["$featuredImg", collectionDefaultImage] },
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
        },
      },
    ];

    if (!all) {
      pipeline.push({ $skip: limit * (page - 1) });
      pipeline.push({ $limit: limit });
    }

    const collections = await Collection.aggregate(pipeline);
    // console.log("collections.....@@@", collections);
    const allcollections = await Collection.find();
    return res.send({
      success: true,
      message: "Collections fetched successfully",
      data: {
        collections: allcollections.length ? allcollections : null,

        // pagination: {
        //     page, limit, total,
        //     pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
        // }
      },
    });
  } catch (error) {
    return next(error);
  }
};
exports.all = async (req, res, next) => {
  try {
    let { page, limit, categoryId, all, userId } = req.query;
    // console.log(userId,"userId===>")
    // let userId = req.user
    // console.log("userId------@", userId);
    // console.log("category------@", req.categoryId)
    // if (!userId)
    //     return res.status(400).send({ success: false, message: 'Please Sign In First' })

    const filter = {};

    // if (userId)
    //     filter.userId = ObjectId(userId)

    if (categoryId) filter.categoryId = ObjectId(categoryId);

    let total = 0;

    // if (!all) {
    //     page = page !== undefined && page !== '' ? parseInt(page) : 1
    //     limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

    //     total = await Collection.countDocuments(filter)

    //     if (page > Math.ceil(total / limit) && total > 0)
    //         page = Math.ceil(total / limit)

    // }

    const pipeline = [
      {
        $match: filter,
      },
      { $sort: { name: 1 } },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "categoryId",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          logo: 1,
          userId: 1,
          featuredImg: { $ifNull: ["$featuredImg", collectionDefaultImage] },
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
        },
      },
    ];

    // if (!all) {
    //     pipeline.push({ $skip: limit * (page - 1) })
    //     pipeline.push({ $limit: limit })
    // }

    const collections = await Collection.aggregate(pipeline);
    // console.log("collections.....@@@", collections);

    return res.send({
      success: true,
      message: "Collections fetched successfully",
      data: {
        collections: collections.length ? collections : null,
        // pagination: {
        //     page, limit, total,
        //     pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
        // }
      },
    });
  } catch (error) {
    return next(error);
  }
};
