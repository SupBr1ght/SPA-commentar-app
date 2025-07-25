import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDTO } from 'src/dto/createPostDTO';
import { sanitizeHTML } from 'src/utils/sanitiseInput';

@Injectable()
export class PostService {
    private readonly logger = new Logger(PostService.name);

    constructor(readonly prismaServiсe: PrismaService) { }

    async createPost(createPostDTO: CreatePostDTO) {

        const { authorId, rating, title, body } = createPostDTO;

        const cleanTitle = sanitizeHTML(title);
        const cleanBody = sanitizeHTML(body);

        const post = await this.prismaServiсe.post.create({
            data: {
                title: cleanTitle,
                body: cleanBody,
                authorId,
                rating
            }

        });

        this.logger.log(`Created post: ${post.id}`);
        return post;
    }

    async getPostWithAuthor(postId: string) {
        if (!postId) throw new NotFoundException('Post ID is missing');

        const post = await this.prismaServiсe.post.findUnique({
            where: { id: postId },
            include: {
                author: true,
                comments: true
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }

        return post;
    }
}
