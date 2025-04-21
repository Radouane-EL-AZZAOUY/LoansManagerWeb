export interface PaymentDto {
    id: number;
    clientId: number;
    clientName?: string;
    amount: number;
    date: Date;
    description?: string;
}