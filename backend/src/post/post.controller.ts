import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { CreatePostDTO } from '..//dto/createPostDTO';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private postService: PostService) { }

    @Post()
    createPost(@Body(new ValidationPipe()) createPostDTO: CreatePostDTO) {
        return this.postService.createPost(createPostDTO)
    }

    @Get(':id')
    async getPost(@Param('id') postId: string) {
        return this.postService.getPostWithAuthor(postId);
    }

}
