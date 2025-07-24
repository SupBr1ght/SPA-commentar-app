import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDTO } from 'src/dto/createPostDTO';

@Injectable()
export class PostService {
    private readonly logger = new Logger(PostService.name);

    constructor(readonly prismaServiсe: PrismaService) { }

    async createPost(createPostDTO: CreatePostDTO) {

        const { authorId, rating, title, body } = createPostDTO;

        const post = await this.prismaServiсe.post.create({
            data: {
                title,
                body,
                authorId,
                rating
            }

        });


        this.logger.log(`Created post: ${post.id}`);
        return post;
    }
}
