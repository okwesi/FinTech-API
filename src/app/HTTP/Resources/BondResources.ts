export interface BondResource {
    _id: string;
    bondName: string;
    faceValue: number;
    couponRate: number;
    maturityDate: Date;
    purchaseValue: number;
    paymentFrequency: string;
    purchaseDate: Date;
    organization: string;
    dateCreated: Date;
    dateUpdated: Date;
    dateDeleted: Date;
    isDeleted: boolean;
}