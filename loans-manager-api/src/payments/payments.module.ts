import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from 'src/entity/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/entity/client.entity';
import { MapperService } from 'src/mapper/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Client])],
  providers: [PaymentsService, MapperService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
