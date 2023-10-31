export default class Response {
    public statusCode: number;
    public data: any;
    public message: string;
    public exception: string;

    constructor(statusCode: number, data: any, message:string, exception: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.exception = exception;
    }
}
