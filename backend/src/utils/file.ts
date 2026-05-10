import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileInterceptorOptions = (fieldName: string) => {
  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: './public/uploads',
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new Error('Only image files are allowed'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  });
};
