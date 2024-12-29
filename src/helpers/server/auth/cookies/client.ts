import { getAccessTokenFromCookies, getRefreshTokenFromCookies } from "@/hooks/cookies";
import { CookieStore } from ".";

export class ClientCookieStore implements CookieStore {
    getAccessToken(): string | undefined {
        const accessToken = getAccessTokenFromCookies();
        return accessToken
    }

    getRefreshToken(): string | undefined {
        const refreshToken = getRefreshTokenFromCookies()
        return refreshToken;
    }
}