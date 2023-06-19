export default interface UserStockLogResource {
    action: string;
    price: number;
    quantity: number;
    actionDate: Date;
    dateCreated: Date;
    dateUpdated: Date;
}