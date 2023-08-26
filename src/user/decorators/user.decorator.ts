import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common/decorators";

export interface userInfo {
    id: number;
    name: string;
    iat: number;
    exp: number;
}


export const User = createParamDecorator((data, req: ExecutionContext) => {

    return (req.switchToHttp().getRequest().user);
})