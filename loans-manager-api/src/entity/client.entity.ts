import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TableForeignKey } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Client {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    status: string;

    @Column()
    createdDate: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    userId: number;
}