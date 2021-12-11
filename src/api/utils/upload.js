// multer
const fs = require('fs')
const multer = require('multer')
const uploadsDir = './src/uploads/'
const imagesDir = `${uploadsDir}images`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // make uploads directory if do not exist
        if (!fs.existsSync(uploadsDir))
            fs.mkdirSync(uploadsDir)

        if (!fs.existsSync(imagesDir))
            fs.mkdirSync(imagesDir)

        cb(null, imagesDir)
    },
    filename: function (req, file, cb) {
        var fileExtension = file.mimetype.split("/")[1]
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return cb(new Error('Only image files are allowed.'))
        }
        cb(null, + Date.now() + '.' + fileExtension)
    }
})
const upload = multer({ storage })
exports.cpUpload = upload.fields([{ name: 'image', maxCount: 1 }])
exports.uploadSingle = upload.single('image')
exports.collectionUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'featuredImg', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
exports.profileUpload = upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'bannerImage', maxCount: 1 }])

// ipfs
const { create } = require('ipfs-http-client')
const { ipfsServerUrl, ipfsBaseUrl } = require('../../config/vars')
const ipfs = create(ipfsServerUrl)

exports.addImage = async (data) => {
    const fileAdded = await ipfs.add(data)
    const imgHash = (fileAdded.cid).toString()
    return `${ipfsBaseUrl}${imgHash}`
}

exports.addContent = async (data) => {
    const doc = JSON.stringify(data);
    const dataAdded = await ipfs.add(doc);
    const dataHash = (dataAdded.cid).toString()
    return `${ipfsBaseUrl}${dataHash}`
}