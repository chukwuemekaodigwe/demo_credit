export default interface User {
    id?: number,
    firstname: string,
    lastname: string,
    email?: string,
    phone?: number,
    address?: string,
    password: string,
    created_at?: Date,
    updated_at?: Date
}