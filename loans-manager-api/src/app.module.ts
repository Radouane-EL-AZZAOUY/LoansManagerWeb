import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './users/user.module';
import { ClientModule } from './clients/clients.module';
import { LoanModule } from './loans/loans.module';
import { PaymentsModule } from './payments/payments.module';
import { MapperService } from './mapper/mapper.service';
import { ClientService } from './clients/clients.service';
import { LoanService } from './loans/loans.service';
import { PaymentsService } from './payments/payments.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UserModule,
    ClientModule,
    LoanModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [MapperService],
})
export class AppModule {}
