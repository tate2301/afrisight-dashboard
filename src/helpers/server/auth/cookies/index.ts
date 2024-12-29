export abstract class CookieStore {
    abstract getAccessToken(): string | undefined
    abstract getRefreshToken(): string | undefined
}