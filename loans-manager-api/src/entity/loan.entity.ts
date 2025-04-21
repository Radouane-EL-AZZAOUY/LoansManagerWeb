import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { Client } from "./client.entity";


@Entity()
export class Loan {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'clientId' })
    clientId: number;

    @Column()
    amount: number;

    @Column()
    quantity: number;

    @Column()
    date: Date;

    @Column()
    status: string;

    @Column()
    description: string;
}