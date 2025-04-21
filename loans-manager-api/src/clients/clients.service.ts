import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "../entity/client.entity";
import { Repository } from "typeorm";
import { MapperService } from "src/mapper/mapper.service";


@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private clientRepo: Repository<Client>,
        private mapper: MapperService
    ) {}

    async getClients() {

        const clientsWithLoanInfo = await this.clientRepo.query(`
            SELECT 
                c.id, 
                c.firstName, 
                c.lastName, 
                c.phone, 
                c.status, 
                COUNT(l.id) AS totalLoans, 
                SUM(l.amount) AS totalAmount  
            FROM 
                client c 
            LEFT JOIN 
                loan l ON c.id = l.clientId 
            GROUP BY 
                c.id, c.firstName, c.lastName, c.phone, c.status
        `);
        
        return clientsWithLoanInfo;
    }

    async getUserClients(userId: number) {

        const clientsWithLoanInfo = await this.clientRepo.query(`
            SELECT 
                c.id, 
                c.firstName, 
                c.lastName, 
                c.phone, 
                c.status,
                c.userId, 
                COUNT(l.id) AS totalLoans, 
                SUM(l.amount) AS totalAmount  
            FROM 
                client c 
            LEFT JOIN 
                loan l ON c.id = l.clientId 
            WHERE
                c.userId = ?
            GROUP BY 
                c.id, c.firstName, c.lastName, c.phone, c.status
        `, [userId]);
        
        return clientsWithLoanInfo;
    }

    async getClient(id: number) {
        return await this.clientRepo.findOneBy({ id: id });
    }

    async createClient(client: Partial<Client>) {
        const result = await this.clientRepo.findOneBy({ phone: client.phone});
        if (result) {
            return { message: "Client phone already exists" };
        }
        return await this.clientRepo.save(this.mapper.clientToEntity(client));
    }

    async updateClient(id: number, client: Partial<Client>) {
        await this.clientRepo.update(id, this.mapper.clientToEntity(client));
        return await this.clientRepo.findOneBy({ id });        
    }

    async deleteClient(id: number) {
        await this.clientRepo.delete(id);
        return { deleted: true }; 
    }

}