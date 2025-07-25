import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDTO } from '../dto/createCommentDTO';

export type CommentNode = {
    id: string;
    text: string;
    parentId: string | null;
    author?: any; // або твій тип юзера
    createdAt?: Date;
    replies: CommentNode[];
    // Додай інші поля, які тобі потрібні
};

@Injectable()
export class CommentService {
    private readonly logger = new Logger(CommentService.name);

    constructor(readonly prismaServiсe: PrismaService) { }

    private buildTree(comments: CommentNode[]): CommentNode[] {
        // map string or CommentNode
        const map = new Map<string, CommentNode>();
        // main commentar
        const roots: CommentNode[] = [];

        // create copy every commentar under post and make map from them
        for (const comment of comments) {
            // key: comment.id, value all comment fileds and add new peplies
            map.set(comment.id, { ...comment, replies: [] });
        }

        for (const comment of comments) {
            // If this commentar is reply
            if (comment.parentId) {
                // find parent comment and add this child comment to it 
                // this is nor null and neither undefined
                const child = map.get(comment.id)!;
                const parent = map.get(comment.parentId);
                parent?.replies.push(child);
            } else {
                roots.push(map.get(comment.id)!);
            }
        }

        return roots;
    }

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

    async getComments(
        postId: string,
        sortBy: 'name' | 'email' | 'date',
        order: 'asc' | 'desc',
        page: number
    ) {
        const pageSize = 25;
        // how many we need to skip pages
        const skip = (page - 1) * pageSize;

        const comments = await this.prismaServiсe.comment.findMany({
            where: {
                postId,
            },
            orderBy:
                sortBy === 'date'
                    ? { createdAt: order }
                    : sortBy === 'name'
                        ? { author: { name: order } }
                        : { author: { email: order } },
            skip,
            take: pageSize,
            include: {
                author: true,
            },
        });

        const commentsWithReplies = comments.map(comment => ({
            ...comment,
            replies: [],
        }));

        // build tree
        const tree = this.buildTree(commentsWithReplies);

        return tree;
    }

}   
