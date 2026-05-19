import express from 'express';
import { upload } from '../../middleware/upload';
import { uploadLogo } from './upload-controller';

const router = express.Router();

router.post('/upload-logo', upload.single('file'), uploadLogo);

export default router;
