import { IsAlphanumeric, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name can only contain letters, digits, and spaces' })
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl({}, { message: 'Homepage must be a valid URL' })
  homepage?: string;
}

