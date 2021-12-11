const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId
const UserModal = require('../../models/users.model');
const { addImage } = require('../../utils/upload');

exports.create = async (req, res, next) => {
  try {
    let user = await UserModal.create(req.body);
    return res.send({status: true, data: user});
  } catch (error) {
    return next(error);
  }
};
exports.update = async (req, res, next) => {
  try {
    let payload = req.body;
    const _id = req.user;
    if(!payload.username) {
      return res.send({status: false, message: "Please fill all required fields"});
    }
    // if(req.file) {
    //   const imgData = fs.readFileSync(req.file.path)
    //   payload.profileImage = await addImage(imgData);
    // }
    if (req.files) {
      for (const key in req.files) {
        const image = req.files[key][0]
        const imgData = fs.readFileSync(image.path)
        payload[key] = await addImage(imgData)
      }
    }
        
    let user = await UserModal.findByIdAndUpdate({_id}, {$set : payload}, {new: true});
    let data = user.transform();
    return res.send({status: true, data, message: "Your profile is updated successfully."});
  } catch (error) {
    return next(error);
  }
};
exports.getCreators = async (req, res, next) => {
  try {
    let users = await UserModal.aggregate([
      {
        $match: {}
      },
      {
        $project: {
          profileImage: 1,
          username: 1,
          address: 1
        }
      }
    ]);
    // console.log(users,"users===>")
    return res.send({status: true, data: users, message: "Authors fetched succesfully"});
  } catch (error) {
    return next(error);
  }
};
exports.topSellers = async (req, res, next) => {
  try {
    let users = await UserModal.aggregate([
      {
        $match: {}
      },
      {
        $project: {
          profileImage: 1,
          username: 1,
          address: 1
        }
      }
    ]);
    return res.send({status: true, data: users, message: "Top Sellers fetched succesfully"});
  } catch (error) {
    return next(error);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    let {userId} = req.params;
    
    let user = await UserModal.findOne({_id: ObjectId(userId)});
    user = user.transform();
    return res.send({status: true, data: user, message: "Top Sellers fetched succesfully"});
  } catch (error) {
    return next(error);
  }
};