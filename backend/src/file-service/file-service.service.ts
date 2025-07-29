import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

const MAX_TEXT_FILE_SIZE = 100 * 1024; // 100 KB
const ALLOWED_TEXT_EXTENSIONS = ['.txt'];
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_WIDTH = 320;
const MAX_HEIGHT = 240;

@Injectable()
export class FileService {
  async processAndSaveImage(
    file: Express.Multer.File,
  ): Promise<{ url: string; type: 'image' | 'text' }> {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    // create directory id it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const outputFilename = `${Date.now()}-${file.originalname}`;
    const outputPath = path.join(uploadsDir, outputFilename);

    console.log('file.mimetype:', file.mimetype);
    console.log('file.originalname:', file.originalname);

    // Text file
    if (ALLOWED_TEXT_EXTENSIONS.includes(ext)) {
      if (file.size > MAX_TEXT_FILE_SIZE) {
        throw new Error('Text file is too large');
      }

      fs.writeFileSync(outputPath, file.buffer);

      return {
        url: `/uploads/${outputFilename}`,
        type: 'text',
      };
    }

    // Image
    if (ALLOWED_IMAGE_MIME_TYPES.includes(mimetype)) {
      await sharp(file.buffer)
        .resize({
          width: MAX_WIDTH,
          height: MAX_HEIGHT,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFile(outputPath);

      return {
        url: `/uploads/${outputFilename}`,
        type: 'image',
      };
    }

    // BAD FILE TYPE
    throw new Error('Unsupported file type');
  }
}
