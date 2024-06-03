import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ServicesModule } from './services/services.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './orders/order.entity';
import { Service } from './services/service.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global
      envFilePath: '.env', // Load environment variables from .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Order, Service],
        synchronize: true,
        logging: configService.get<boolean>('DATABASE_LOGGING', false),
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
    ServicesModule,
  ],
})
export class AppModule {}
