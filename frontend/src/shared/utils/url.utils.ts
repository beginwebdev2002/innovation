import { environment } from "@environments/environment"

export function apiUrlMaker(imgUrl: string): URL {
    const host = environment.apiUrl;
    const url = new URL(imgUrl, host);
    return url;
}