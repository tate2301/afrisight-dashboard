import { cookies } from "next/headers";
import { CookieStore } from ".";

export class ServerCookieStore implements CookieStore {
    getAccessToken(): string | undefined {
        const cookieStore = cookies(); // Access server-side cookies
        return cookieStore.get('access_token')?.value;

    }

    getRefreshToken(): string | undefined {
        const cookieStore = cookies(); // Access server-side cookies
        return cookieStore.get('refresh_token')?.value;
    }
}