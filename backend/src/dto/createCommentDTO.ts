import { IsNotEmpty, IsString, Matches, IsUUID, IsOptional, IsIn } from 'class-validator';

export class CreateCommentDTO {
    @IsNotEmpty()
    @IsString()
    // to prevent Cross Site Scripting injection
    @Matches(/^[^<>]+$/, { message: 'Text must not contain HTML tags' })
    @IsNotEmpty()
    text: string;

    @IsUUID()
    @IsNotEmpty()
    postId?: string;

    @IsUUID()
    @IsNotEmpty()
    authorId: string

    @IsUUID()
    @IsOptional()
    parentId: string

}
