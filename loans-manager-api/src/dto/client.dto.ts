export interface ClientDto {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    status: string;
    createdDate: Date;
    userId: number;
    totalLoans?: number;
    totalAmount?: number;
}