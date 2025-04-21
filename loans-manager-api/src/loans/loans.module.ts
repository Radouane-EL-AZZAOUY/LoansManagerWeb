import { Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { Loan } from 'src/entity/loan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanService } from './loans.service';
import { MapperService } from 'src/mapper/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  providers: [LoanService, MapperService],
  controllers: [LoansController]
})
export class LoanModule {}
