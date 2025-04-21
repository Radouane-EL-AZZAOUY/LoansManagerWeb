export interface LoanDto {
    id: number;
    clientId: number;
    clientName: string;
    amount: number;
    quantity: number;
    date: Date;
    status: string;
    description: string;
}