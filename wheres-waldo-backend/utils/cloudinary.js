const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadStream = asyncHandler(async (bufferImg) => {
    return new Promise((resolve, reject) => {
        streamifier.createReadStream(bufferImg).pipe(
            cloudinary.uploader.upload_stream(
                {
                    folder: "wheres-waldo",
                    transformation: [
                        { width: 1200, crop: "scale" },
                    ]
                },
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            )
        )
    })
})

const deleteImg = asyncHandler(async (imgId) => {
    await cloudinary.uploader.destroy(imgId, (err, result) => {
        if (err){
            console.log(err)
        } else {
            console.log(result)
        }
    })
});

module.exports = { uploadStream, deleteImg }