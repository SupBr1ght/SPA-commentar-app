import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDTO } from '../dto/createCommentDTO';
import { sanitizeHTML } from '../utils/sanitiseInput';

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

        //  return parent or parent with nested comments
        map.forEach(comment => {
            if (comment.parentId) {
                const parent = map.get(comment.parentId);
                if (parent) {
                    parent.replies!.push(comment);
                }
            } else {
                roots.push(comment);
            }
        });

        return roots;
    }

    async createComment(createCommentDTO: CreateCommentDTO) {

        const { authorId, postId, text, parentId, fileType, fileUrl } = createCommentDTO;
        
        const cleanText = sanitizeHTML(text);


        const comment = await this.prismaServiсe.comment.create({
            data: {
                text: cleanText,
                post: {
                    connect: { id: postId },
                },
                author: {
                    connect: { id: authorId },
                },
                parent: parentId ? { connect: { id: parentId } } : undefined,
                fileUrl,
                fileType
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
        const skip = (page - 1) * pageSize;


        const comments = await this.prismaServiсe.comment.findMany({
            where: {
                postId,
                parentId: null
            },
            orderBy:
                sortBy === 'date'
                    ? { createdAt: order }
                    : sortBy === 'name'
                        ? { author: { name: order } }
                        : { author: { email: order } },
            take: pageSize,
            include: {
                author: true,
            },
        });

        const allComments = await this.prismaServiсe.comment.findMany({
            where: { postId },
            include: { author: true },
        });

        const commentsWithReplies: CommentNode[] = allComments.map(comment => ({
            ...comment,
            replies: [],
        }));
        
        const tree = this.buildTree(commentsWithReplies);
        const topLevelWithReplies = tree.slice(skip, skip + pageSize);
        return topLevelWithReplies;
    }

}   
