import Pagination from "../../../interfaces/PaginationInterface";

interface StockResource {
    _id: string;
    stockName: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    isDeleted: boolean;
    purchasePrice: number;
    purchaseQuantity: number;
    currentQuantity: number;
    stockSymbol: string;
    purchaseDate: Date;
    brokerage: string;
}

export default interface StocksResource {
    pagination: Pagination;
    stocks: Array<StockResource>;
}
