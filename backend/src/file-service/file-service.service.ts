import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private uploadDir = path.resolve(__dirname, '../../uploads');

  async upload(file: Express.Multer.File): Promise<string> {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const fileName = Date.now() + '-' + file.originalname;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    // return path to file
    return `/uploads/${fileName}`;
  }

}
