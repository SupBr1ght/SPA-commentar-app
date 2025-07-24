import { IsEmail, IsNotEmpty, IsOptional, IsUrl, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and digits',
  })
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl({}, { message: 'Homepage must be a valid URL' })
  homepage?: string;
}

