import { InternalServerErrorException, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    CommonModule,
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => {
        const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';

        if (!secretKey) {
          throw new InternalServerErrorException(
            'JWT secret key is not defined in environment variables.'
          );
        }

        const expiresIn = process.env.JWT_EXPIRATION || '1d';

        return {
          secret: secretKey,
          signOptions: { expiresIn },
        } as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
