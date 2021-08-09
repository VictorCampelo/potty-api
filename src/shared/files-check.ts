import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

export default function checkXlsxFile() {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: './public/uploads',

      filename: (req, file, cb) => {
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),

    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
        return callback(new Error('Only excel files are allowed!'), false);
      }
      callback(null, true);
    },
  });
}
