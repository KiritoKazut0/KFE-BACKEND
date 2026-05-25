import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService, TokenPayload } from './tokenService';


@Injectable()
export class TokenServiceImpl implements TokenService {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    generateToken(payload: TokenPayload): string {
        try {
            return this.jwtService.sign(payload);
        } catch (error) {
            throw new InternalServerErrorException('Failed to generate token');
        }
    }

    verifyToken(token: string): TokenPayload {
        try {
            return this.jwtService.verify<TokenPayload>(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}