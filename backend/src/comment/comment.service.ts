import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma/prisma.service';
import { CreateCommentDTO } from 'src/dto/createCommentDTO';
@Injectable()
export class CommentService {
    private readonly logger = new Logger(CommentService.name);

    constructor(readonly prismaServise: PrismaService) { }

    async createComment(createCommentDTO: CreateCommentDTO) {

        const { userName, email, homepage, text, postId } = createCommentDTO

        const comment = await this.prismaServise.comment.create({
            data: {
                userName,
                email,
                homepage,
                text,
                postId,
                // authorId: user.id,
            },
        });

        this.logger.log(`Created comment: ${comment.id}`);
        return comment;

    }
}   
