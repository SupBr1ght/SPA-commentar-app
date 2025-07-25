import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { FileService } from './file-service/file-service.service';

@Module({
  imports: [  ConfigModule.forRoot({
      isGlobal: true, // доступ до env у будь-якому модулі
    }),CommentModule, PrismaModule, PostModule, UserModule],
  controllers: [AppController, CommentController, PostController],
  providers: [AppService, CommentService, PrismaService, PostService, FileService],
})
export class AppModule {}
