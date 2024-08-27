import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export function GenerateThumbnail(field: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.file?.fieldname == field) {
      const thumbnailPath =
        'images/uploads/' +
        'thumbnails-' +
        uuidv4() +
        '.' +
        getFileType(req.file.filename);

      sharp(req.file.path)
        .resize(200, 200)
        .toFile('public/' + thumbnailPath, (err, resizeImage) => {
          if (err) {
            console.error(err);
          } else {
          }
          req.body['thumbnail_' + field] = thumbnailPath;
          req.body[field] = 'images/uploads/' + req.file!.filename;
          next();
        });
    } else {
      next(new Error('Please upload an image type file'));
    }
  };
}

const getFileType = (name: string) => {
  const array = name.split('.');
  return array[array.length - 1];
};
