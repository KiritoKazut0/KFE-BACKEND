import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TokenService } from "./services/tokenService";
import { TokenServiceImpl } from "./services/tokenServiceImpl";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_SECRET");

        if (!secret) {
          throw new Error("JWT_SECRET is not defined in .env");
        }

        return {
          secret,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: TokenService,
      useClass: TokenServiceImpl,
    },
  ],
  exports: [TokenService],
})
export class SecurityModule {}