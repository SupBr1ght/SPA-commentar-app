import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { CreateCommentDTO } from '../dto/createCommentDTO';
import { CommentService } from './comment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FileService } from '../file-service/file-service.service';

@Controller('comments')
export class CommentController {

    constructor(private commentService: CommentService, private fileService: FileService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createComment(
        @Body(new ValidationPipe()) createCommentDTO: CreateCommentDTO,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let fileUrl: string | undefined;
        let fileType: 'image' | 'text' | undefined;

        if (file) {
            const ext = extname(file.originalname).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            const isText = ['.txt', '.md'].includes(ext);

            if (isImage) fileType = 'image';
            else if (isText) fileType = 'text';
            else throw new BadRequestException('Unsupported file type');

            // Save file in file system
            fileUrl = await this.fileService.upload(file);
        }

        // conver to plain object for spread
        const commentData = {
            text: createCommentDTO.text,
            postId: createCommentDTO.postId,
            authorId: createCommentDTO.authorId,
            parentId: createCommentDTO.parentId,
            fileUrl,
            fileType,
        };

        return this.commentService.createComment(commentData);
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
