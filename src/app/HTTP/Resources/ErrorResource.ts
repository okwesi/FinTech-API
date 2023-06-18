export interface ErrorPayload {
    status: number;
    message: string;
}


export default interface ErrorResource {
    data: any;
    error: ErrorPayload;
}
