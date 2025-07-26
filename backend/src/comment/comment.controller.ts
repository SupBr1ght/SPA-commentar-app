import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CreateCommentDTO } from '../dto/createCommentDTO';
import { CommentService } from './comment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FileService } from '../file-service/file-service.service';
import * as multer from 'multer';
import { CommentsGateway } from './comment.gateway';
const upload = multer({ storage: multer.memoryStorage() });

@Controller('comments')
export class CommentController {

    constructor(
        private commentService: CommentService,
        private fileService: FileService,
        private readonly commentsGateway: CommentsGateway
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createComment(
        @Body(new ValidationPipe()) body: CreateCommentDTO,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let fileUrl: string | undefined | string | undefined;
        let fileType: 'image' | 'text' | undefined;

        if (file) {
            const ext = extname(file.originalname).toLowerCase();

            const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const ALLOWED_TEXT_EXTENSIONS = ['.txt'];

            const isImage = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
            const isText = ALLOWED_TEXT_EXTENSIONS.includes(ext);

            if (!isImage && !isText) {
                throw new BadRequestException('Unsupported file type');
            }
            const result = await this.fileService.processAndSaveImage(file);
            fileUrl = result.url;
            if (result.type === 'image' || result.type === 'text') {
                fileType = result.type;
            } else {
                throw new BadRequestException('Invalid file type returned from file service');
            }
        }

        // conver to plain object for spread
        const commentData = {
            text: body.text,
            postId: body.postId,
            authorId: body.authorId,
            parentId: body.parentId,
            fileUrl,
            fileType,
        };

        const createdComment = await this.commentService.createComment(commentData);
        //implement websocket
        this.commentsGateway.sendNewComment(createdComment);

        return createdComment
    }
    @Get('/post/:postId/comments')
    async getCommentsForPost(
        @Param('postId') postId: string,
        @Query('sortBy') sortBy: 'name' | 'email' | 'date' = 'date',
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('page') page = 1,
    ) {
        return this.commentService.getComments(postId, sortBy, order, page);
    }
}
