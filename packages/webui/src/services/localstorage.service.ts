export default class LocalStorageService {
    public static setToken(token: string){
        localStorage.setItem('token',token);
    }

    public static getToken(): string|null{
        return localStorage.getItem('token');
    }

    public static removeToken(){
        return localStorage.removeItem('token');
    }

    public static set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    public static get(key:string): string|null {
        return localStorage.getItem(key)
    }
}
