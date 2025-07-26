import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from '../dto/createUserDTO';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    createPost(@Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
        return this.userService.createUser(createUserDTO)
    }
}
