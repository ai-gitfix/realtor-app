import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';
import { PrismaService } from "src/prisma/prisma.service";

interface JWTPayload {
    id: number;
    name: string;
    iat: number;
    exp: number;
}


// The request passes from here before the user interceptor !!
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly prismaService : PrismaService) {}

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride('roles',[
            context.getHandler(),
            context.getClass(),
        ]);

        if(!roles){
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split("Bearer ")[1]; //? is used to check if the object is null or not if it is null then it will not throw error because it will stop the execution of rest of the line

        try {
            // we put it in try catch because if the token is not valid then it will throw error and we will return false
            const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

            // request.user = payload; // we can also do this and if we do this we can remove all user interceptor but we will do it in user interceptor

            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id
                }
            });

            if (!user) {
                return false
            }

            return roles.includes(user.user_type);


        } catch (error) {
            return false
        }

        return true
    }
}