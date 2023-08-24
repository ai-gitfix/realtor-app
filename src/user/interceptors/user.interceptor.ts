import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) 
  {

    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split("Bearer ")[1]; //? is used to check if the object is null or not if it is null then it will not throw error because it will stop the execution of rest of the line
    const user = await jwt.decode(token)

    request.user = user;

    return next.handle();
  }
}