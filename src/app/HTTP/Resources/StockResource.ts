
export interface StockResource {
    _id: string;
    stockName: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    isDeleted: boolean;
    purchasePrice: number;
    purchaseQuantity: number;
    stockSymbol: string;
    purchaseDate: Date;
    brokerage: string;
}
