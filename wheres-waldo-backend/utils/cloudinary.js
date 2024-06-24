const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const sharp = require('sharp');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadStream = asyncHandler(async (bufferImg) => {
    // Get the image dimensions
    const metadata = await sharp(bufferImg).metadata();
    const imgWidth = metadata.width
    
    const upload = (buffer, transformationOptions) => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Upload timed out"));
            }, 10000)

            streamifier.createReadStream(buffer).pipe(
                cloudinary.uploader.upload_stream(
                    transformationOptions,
                    function (error, result) {
                        clearTimeout(timeout)
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                )
            )
        })
    };

    let originalTransformationOptions = { 
        folder: "wheres-waldo", 
        transformation: [{ width: imgWidth >= 2000 ? 2000 : imgWidth, crop: "scale" }] 
    };

    let previewTransformationOptions = {
        folder: "wheres-waldo/previews",
        transformation: [{ width: 500, crop: "scale" }]
    };

    const [original, preview] = await Promise.all([
        upload(bufferImg, originalTransformationOptions),
        upload(bufferImg, previewTransformationOptions)
    ]);
    
    return { original, preview };
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