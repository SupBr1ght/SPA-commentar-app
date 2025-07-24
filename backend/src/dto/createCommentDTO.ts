import { IsNotEmpty, IsString, Matches, IsUUID } from 'class-validator';

export class CreateCommentDTO {
    @IsNotEmpty()
    @IsString()
    // to prevent Cross Site Scripting injection
    @Matches(/^[^<>]+$/, { message: 'Text must not contain HTML tags' })
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    post: string;

    @IsUUID()
    @IsNotEmpty()
    postId?: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsUUID()
    @IsNotEmpty()
    authorId: string
}
