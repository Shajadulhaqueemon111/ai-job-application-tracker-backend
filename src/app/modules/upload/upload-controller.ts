import { Request, Response } from 'express';
import { uploadToCloudinary } from './upload-service';

export const uploadLogo = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result: any = await uploadToCloudinary(file.buffer);

    return res.json({
      success: true,
      logo: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error?.message || error,
    });
  }
};
