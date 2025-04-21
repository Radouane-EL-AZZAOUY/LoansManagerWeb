import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entity/client.entity';
import { ClientService } from './clients.service';
import { ClientsController } from './clients.controller';
import { MapperService } from 'src/mapper/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientService, MapperService],
  controllers: [ClientsController],
})
export class ClientModule {}