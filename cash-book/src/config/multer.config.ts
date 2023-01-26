import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express/multer';
import * as crypto from 'crypto';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';

export const tempFolder = resolve(__dirname, '..', '..', 'temp');

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: tempFolder,
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const hash = crypto.randomBytes(16).toString('hex');

          cb(null, `${hash}${fileExtName}`);
        },
      }),
    };
  }
}
