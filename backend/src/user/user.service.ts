import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/createUserDTO';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(readonly prismaService: PrismaService) { }

    async createUser(createUserDTO: CreateUserDTO) {

        const { name, email, homepage } = createUserDTO;

        const user = await this.prismaService.user.create({
            data: {
                name,
                email,
                homepage,
            }

        });

        this.logger.log(`Created post: ${user.id}`);
        return user;
    }


    async getUserById(id: string) {
        return this.prismaService.user.findUnique({
            where: { id },
            include: {
                posts: true, // includes all posts
                comments: true, // includes all commentars
            },
        });
    }
}
