import { parseCookies, setCookie } from "nookies";

export const getAccessTokenFromCookies = (ctx?: any) => {
  const cookies = parseCookies(ctx);
  return cookies["auth_token"];
};

export const setAccessTokenToCookies = (token: string) => {
  setCookie(null, "auth_token", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};

export const getRefreshTokenFromCookies = (ctx?: any) => {
  const cookies = parseCookies(ctx);
  return cookies["refresh_token"];
};

export const setRefreshTokenToCookies = (token: string) => {
  setCookie(null, "refresh_token", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};
