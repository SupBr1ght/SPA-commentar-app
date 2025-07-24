import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from 'prisma/prisma/prisma.module';

@Module({
  imports: [CommentModule, PrismaModule],
  controllers: [AppController, CommentController],
  providers: [AppService, CommentService],
})
export class AppModule {}
