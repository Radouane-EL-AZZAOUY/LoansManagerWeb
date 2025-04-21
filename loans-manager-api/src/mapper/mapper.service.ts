import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
  clientToEntity(client: any): any {
    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      status: client.status,
      createdDate: client.createdDate,
      userId: client.userId
    };
  }

  loanToEntity(loan: any): any {
    return {
      id: loan.id,
      clientId: loan.clientId,
      amount: loan.amount,
      quantity: loan.quantity,
      date: loan.date,
      status: loan.status,
      description: loan.description,
    };
  }

  paymentToEntity(payment: any): any {
    return {
      id: payment.id,
      clientId: payment.clientId,
      amount: payment.amount,
      date: payment.date,
      description: payment.description
    };
  }
}
