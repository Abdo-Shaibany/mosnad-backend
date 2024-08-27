import express from 'express';
import { createImage, deleteImage, getImageById } from 'src/controllers/images';
import auth from 'src/middleware/auth';
import { GenerateThumbnail } from 'src/middleware/thumbnail';
import { uploadImage } from 'src/middleware/upload';
import { createImageValidation } from 'src/validation-schemas/images';

const router = express.Router();

// TODO: add schema to uploading images :)
router.post(
  '/',
  auth,
  createImageValidation,
  uploadImage.single('url'),
  GenerateThumbnail('url'),
  createImage
);

router.delete('/:id', auth, deleteImage);
router.get('/:id', auth, getImageById);

export default router;
