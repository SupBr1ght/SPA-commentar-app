import { IsString, IsUUID, IsNotEmpty, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class CreatePostDTO {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  
  @IsUUID()
  @IsNotEmpty()
  authorId: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}
