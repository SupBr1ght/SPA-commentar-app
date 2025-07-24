import { Body, Controller, Post } from '@nestjs/common';
import { CreateCommentDTO } from 'src/dto/createCommentDTO';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {

    constructor(private commentService: CommentService){}

    @Post()
    create(@Body() createCommentDTO: CreateCommentDTO): Promise<any>{
        // TODO create retur type
        return this.commentService.createComment(createCommentDTO)
    }
}
