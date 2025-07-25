import { Body, Controller, Get, Param, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateCommentDTO } from '../dto/createCommentDTO';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {

    constructor(private commentService: CommentService) { }

    @Post()
    createComment(@Body(new ValidationPipe()) createCommentDTO: CreateCommentDTO) {
        return this.commentService.createComment(createCommentDTO)
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
