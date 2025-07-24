import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateCommentDTO } from '../dto/createCommentDTO';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {

    constructor(private commentService: CommentService){}

    @Post()
    createComment(@Body(new ValidationPipe()) createCommentDTO: CreateCommentDTO){
        return this.commentService.createComment(createCommentDTO)
    }
}
