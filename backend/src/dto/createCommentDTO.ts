import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, IsUrl, IsUUID } from 'class-validator';

export class CreateCommentDTO {
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'User name must contain only latin letters and numbers' })
    userName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsUrl({}, { message: 'Homepage must be a valid URL' })
    homepage?: string;


    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]+$/, { message: 'Captcha must contain only latin letters and numbers' })
    captcha: string;

    @IsNotEmpty()
    @IsString()
    // to prevent Cross Site Scripting injection
    @Matches(/^[^<>]+$/, { message: 'Text must not contain HTML tags' })
    text: string

    @IsUUID()
    @IsNotEmpty()
    postId: string;

}
