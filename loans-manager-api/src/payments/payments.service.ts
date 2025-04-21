import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entity/client.entity';
import { Payment } from 'src/entity/payment.entity';
import { MapperService } from 'src/mapper/mapper.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(Client)
    private clientRepo: Repository<Client>,
    private mapper: MapperService,
  ) {}

  async getPayments() {
    return await this.paymentRepo.query(
        `SELECT 
          p.id, 
          p.amount, 
          p.date, 
          p.description,  
          p.clientId,
          CONCAT(c.firstName, ' ', c.lastName) AS clientName 
        FROM 
          payment p
        LEFT JOIN 
          client c ON c.id = p.clientId`,
      );
  }

  async getPayment(id: number) {
    return await this.paymentRepo.query(
        `SELECT 
          p.id, 
          p.amount, 
          p.date, 
          p.description,  
          p.clientId,
          CONCAT(c.firstName, ' ', c.lastName) AS clientName 
        FROM 
          payment p
        LEFT JOIN 
          client c ON c.id = p.clientId WHERE p.id = ?`,
        [id],
      );
  }

  async getClientPayments(clientId: number) {
    return await this.paymentRepo.query(
      `SELECT 
        p.id, 
        p.amount, 
        p.date, 
        p.description,  
        p.clientId,
        CONCAT(c.firstName, ' ', c.lastName) AS clientName 
      FROM 
        payment p
      LEFT JOIN 
        client c ON c.id = p.clientId WHERE p.clientId = ?`,
      [clientId],
    );
  }

  async createPayment(payment: Partial<Payment>) {
    const result = await this.clientRepo.findOneBy({ id: payment.clientId });
    if (result) {
      return await this.paymentRepo.save(this.mapper.paymentToEntity(payment));
    }
    return { message: 'client not found' };
  }

  async updatePayment(id: number, payment: Partial<Payment>) {
    await this.paymentRepo.update(id, this.mapper.paymentToEntity(payment));
    return await this.paymentRepo.findOneBy({ id });
  }

  async deletePayment(id: number) {
    await this.paymentRepo.delete(id);
    return { deleted: true };
  }
}
