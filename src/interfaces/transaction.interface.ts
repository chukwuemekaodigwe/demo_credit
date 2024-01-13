export default interface Transaction {
    id?: number,
    user_id: number,
    transactiontype: number,
    amount: number,
    transactionId: string,
    beneficiary?: number,
    comment?: string,
    created_at?: Date,
    updated_at?: Date,
}
