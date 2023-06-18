import Pagination from "../../../interfaces/PaginationInterface";
import { BondResource } from "./BondResources";

export default interface BondsResource {
    bonds: BondResource[];
    pagination: Pagination;
}
