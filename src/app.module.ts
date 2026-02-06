import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5435', 10),
      username: process.env.DB_USERNAME ?? 'nest_user',
      password: process.env.DB_PASSWORD ?? 'nest_password',
      database: process.env.DB_DATABASE ?? 'nest_db',
      synchronize: process.env.DB_SYNCHRONIZE === '1',
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === '1',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
