import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CaptchaService {
  private readonly secretKey = process.env.RECAPTCHA_SECRET_KEY; // тримай в .env

  async validateCaptcha(token: string): Promise<boolean> {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${token}`;

    try {
      const response = await axios.post(url);
      return response.data.success;
    } catch (error) {
      throw new HttpException('Captcha validation failed', HttpStatus.BAD_REQUEST);
    }
  }
}