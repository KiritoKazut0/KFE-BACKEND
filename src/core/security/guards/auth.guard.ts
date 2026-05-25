import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { TokenService } from "../services/tokenService";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor( private readonly tokenService: TokenService) {}

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest<Request>();

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("Token requerido");
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            throw new UnauthorizedException("Token inválido");
        }

        const payload = this.tokenService.verifyToken(token);

        request["user"] = payload;

        return true;
    }
}