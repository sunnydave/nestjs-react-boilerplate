import {Response} from '../models';
import axios from "axios";
import {LocalStorageService} from "./index";

export default class BaseService {
    private static baseUrl: string = process.env.REACT_APP_API_URL ?? '';

    private static success<T>(response: any): Response {
        const result = response.data;
        if (result && (result.statusCode === 200 || result.statusCode === 201)){
            const returnResponse = new Response(result.statusCode, result.data as Array<T>, "Success", "");
            return returnResponse;
        }else {
            const message = (result.messageList && result.messageList.length > 0)? result.messageList[0].text:"Error";
            return new Response(result.statusCode, null, "Error", message);
        }
    }

    private static error(error: any): Response {
        if (error && error.response){
            return new Response(error.response.status, error.response.data, "Error", error.response.statusText)
        }
        console.error(error);
        return new Response(500, {}, "Error", "");

    }

    private static getHeaders(): any {
        return {
            'Authorization': `Bearer ${LocalStorageService.getToken()}`
        }
    }

    public static async getAll<T>(url: string, page: number, limit: number): Promise<Response | void> {
        let requestUrl = `${this.baseUrl}\\${url}`;
        if (page !== 0 && limit !== 0){
            requestUrl = `${requestUrl}?page=${page}&limit=${limit}`;
        }
        console.log(requestUrl);
        const response = axios.get<Array<T>>(`${requestUrl}`, {
            headers: this.getHeaders()
        })
            .then((response: any) => {
                return this.success<T>(response);
            })
            .catch(error => {
                this.error(error);
            })
        return response;
    }

    public static async get<T>(url: string, param: string = ''): Promise<Response | void> {
        const response = axios.get<T>(`${this.baseUrl}\\${url}\\${param}`, {
            headers: this.getHeaders()
        })
            .then((response: any) => {
                return this.success<T>(response)
            })
            .catch(function (error){
                return error(error);
            })
        return response;
    }

    public static async delete<T>(url: string, param: any): Promise<Response | void> {
        const response = axios.delete(`${this.baseUrl}\\${url}`, {data: param, headers: this.getHeaders()})
            .then(response => {
                return this.success<T>(response)
            })
            .catch(error => {
                return this.error(error);
            })
        return response;
    }

    public static async create<T>(url: string, obj: T): Promise<Response | void> {
        const response = axios.post(`${this.baseUrl}\\${url}`, obj, {headers: this.getHeaders()})
            .then(response => {
                return this.success<T>(response);
            })
            .catch(error => {
                return this.error(error);
            })
        return response;
    }

    public static async update<T>(url: string, param: any, obj: T): Promise<Response | void> {
        const response = axios.post(`${this.baseUrl}\\${url}\\${param}`, obj, {headers: this.getHeaders()})
            .then(response => {
                return this.success<T>(response);
            })
            .catch(error => {
                return this.error(error);
            })
        return response;
    }
}
