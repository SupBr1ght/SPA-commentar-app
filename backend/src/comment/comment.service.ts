import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDTO } from '../dto/createCommentDTO';

@Injectable()
export class CommentService {
    private readonly logger = new Logger(CommentService.name);

    constructor(readonly prismaServiсe: PrismaService) { }

    async createComment(createCommentDTO: CreateCommentDTO) {

        const { authorId, postId, text } = createCommentDTO;

        const comment = await this.prismaServiсe.comment.create({
            data: {
                text,
                post: {
                    connect: { id: postId },
                },
                author: {
                    connect: { id: authorId },
                },
            },
        });


        this.logger.log(`Created comment: ${comment.id}`);
        return comment;

    }
}   
