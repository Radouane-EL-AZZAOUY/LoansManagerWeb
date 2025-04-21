import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/entity/loan.entity';
import { MapperService } from 'src/mapper/mapper.service';
import { Repository } from 'typeorm';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
    private mapper: MapperService,
  ) {}

  async getLoans() {
    return await this.loanRepo.query(`
      SELECT 
        l.id, 
        l.amount, 
        l.quantity,
        l.date, 
        l.description, 
        l.status, 
        l.clientId,
        CONCAT(c.firstName, ' ', c.lastName) AS clientName 
      FROM 
        loan l 
      JOIN 
        client c ON c.id = l.clientId
    `);
  }

  // async getStatistics() {
  //   return await this.loanRepo.query(`
  //    SELECT
  //       (SELECT COUNT(*) FROM client) AS totalClients,
  //       (SELECT COUNT(*) FROM loan) AS totalLoans,
  //       (SELECT SUM(quantity * amount) FROM loan) AS totalValue,
  //       (SELECT COUNT(*) FROM payment) AS totalPayments,
  //       (SELECT SUM(amount) FROM payment) AS totalPaid,
  //       (SELECT AVG(amount) FROM loan) AS averageLoanValue,
  //       (SELECT COUNT(*) FROM loan WHERE status = 'active') AS activeLoans;
  //   `);
  // }
  
  async getStatistics(userId: number) {
    return await this.loanRepo.query(`
      SELECT
        (SELECT COUNT(*) FROM client WHERE userId = ${userId}) AS totalClients,
        (SELECT COUNT(*) FROM loan 
         WHERE clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS totalLoans,
        (SELECT SUM(quantity * amount) FROM loan 
         WHERE clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS totalValue,
        (SELECT COUNT(*) FROM payment 
         WHERE clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS totalPayments,
        (SELECT SUM(amount) FROM payment 
         WHERE clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS totalPaid,
        (SELECT COALESCE(AVG(amount), 0) FROM loan 
         WHERE clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS averageLoanValue,
        (SELECT COUNT(*) FROM loan 
         WHERE status = 'active' AND clientId IN (SELECT id FROM client WHERE userId = ${userId})) AS activeLoans
    `);
  }

  async getLoan(id: number) {
    return await this.loanRepo.query(
      `
        SELECT
        l.id, 
        l.amount, 
        l.quantity,
        l.date, 
        l.description, 
        l.status, 
        l.clientId,
        CONCAT(c.firstName, ' ', c.lastName) AS clientName 
      FROM 
        loan l 
      LEFT JOIN 
        client c ON c.id = l.clientId WHERE l.id = ?`,
      [id],
    );
  }

  async getClientLoans(clientId: number) {
    return await this.loanRepo.query(
      `SELECT 
        l.id, 
        l.amount, 
        l.quantity,
        l.date, 
        l.description, 
        l.status, 
        l.clientId,
        CONCAT(c.firstName, ' ', c.lastName) AS clientName 
      FROM 
        loan l 
      LEFT JOIN 
        client c ON c.id = l.clientId WHERE l.clientId = ?`,
      [clientId],
    );
  }

  async createLoan(loan: Loan) {
    return await this.loanRepo.save(this.mapper.loanToEntity(loan));
  }

  async updateLoan(id: number, loan: Loan) {
    await this.loanRepo.update(id, this.mapper.loanToEntity(loan));
    return await this.loanRepo.findOneBy({ id });
  }

  async deleteLoan(id: number) {
    await this.loanRepo.delete(id);
    return { deleted: true };
  }
}
