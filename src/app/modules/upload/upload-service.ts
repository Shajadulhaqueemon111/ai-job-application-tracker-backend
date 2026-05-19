import cloudinary from '../../config/cloudinary';

export const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'logos' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};
