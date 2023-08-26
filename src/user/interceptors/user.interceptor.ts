import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
//Step:17: Create UserInterceptor class and implement NestInterceptor interface so that we can find who is the user who is making the request
//P.S. it will not work if we don't add it to providers array in app.module.ts file and also we have to add it to the controller method as a user decorator 
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