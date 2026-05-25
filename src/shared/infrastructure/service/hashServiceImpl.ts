import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { hash, compare } from "bcrypt";
import { HashService } from "../../application/service/hashService";

@Injectable()
export default class HashServiceImpl implements HashService {
    private readonly saltRounds: number;

    constructor(private readonly config: ConfigService) { 
        this.saltRounds = Number.parseInt(this.config.get<string>('SALT_ROUNDS', '10'), 10);
    }

    async hash(password: string): Promise<string> {
        try {
            return await hash(password, this.saltRounds);
        } catch (error) {
            throw new Error('Failed to hash password');
        }
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        try {
            return await compare(password, passwordHash);
        } catch (error) {
            throw new Error("Failed to compare password");
        }
    }
}