import Pagination from "../../../interfaces/PaginationInterface";
import { StockResource } from "./StockResource";

export default interface StocksResource {
    pagination: Pagination;
    stocks: Array<StockResource>;
}
