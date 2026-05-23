

export type TokenPayload = {
    sub: string;
    role: string;
}

export abstract class TokenService {
    abstract generateToken(payload: TokenPayload): string;
    abstract verifyToken(token: string): TokenPayload;
}