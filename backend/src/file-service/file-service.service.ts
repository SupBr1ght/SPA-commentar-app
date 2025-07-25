import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';



const MAX_WIDTH = 320;
const MAX_HEIGHT = 240;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']

@Injectable()
export class FileService {
  async processAndSaveImage(file: Express.Multer.File): Promise<{ url: string, type: 'image' | 'text'  }> {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Unsupported file type');
  }

  const outputFilename = `${Date.now()}-${file.originalname}`;
  const outputPath = path.join(__dirname, '..', '..', 'uploads', outputFilename);

  // add ability to resize image
  await sharp(file.buffer)
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: 'inside', // decrease proportionaly
      withoutEnlargement: true, // don't streach if image less than required
    })
    .toFile(outputPath);

  return {
    url: `/uploads/${outputFilename}`,
    type: "image",
  };
}
}