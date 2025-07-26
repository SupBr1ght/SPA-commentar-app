// comment.module.ts або app.module.ts
import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentsGateway } from './comment.gateway';
import { CommentService } from './comment.service';
import { FileService } from '../file-service/file-service.service';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    FileService,
    CommentsGateway, 
  ],
})
export class CommentModule {}
