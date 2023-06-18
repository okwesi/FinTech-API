export interface Stock {
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

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default interface StockResource {
    pagination: Pagination;
    stocks: Array<Stock>;
}
