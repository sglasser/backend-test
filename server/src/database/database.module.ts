import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mariadb',
        port: ConfigService.getOrThrow('DB_PORT'),
        database: ConfigService.getOrThrow('DB_NAME'),
        username: ConfigService.getOrThrow('DB_USER'),
        password: ConfigService.getOrThrow('DB_PASS'),
        host: ConfigService.getOrThrow('DB_HOST'),
        autoLoadEntities: true,
        //synchronize: true, // Don't use this in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
