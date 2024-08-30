export const AUTH_ROUTES = {
  REFRESH_TOKEN: "/auth/token/refresh",
  USER_OBJECT: "/auth/profile",
  USER_PROFILE: "/profile",
  LOGIN: "/auth/login/email",
  CREATE_USER: "/auth/register/email",
};

export const USER_ROUTES = {
  GET_ALL_USERS: "/profile",
};

export const VOUCHER_ROUTES = {
  CREATE_VOUCHER: "/voucher",
  GET_ALL_VOUCHERS: "/voucher",
};

export const GAMIFICATION_ROUTES = {
  GET_REWARDS: "/gamification/rewards",
  ADD_STORE_ITEM: "/gamification/store/item",
  GET_STORE_ITEMS: "/gamification/store",
};

export const SURVEY_ROUTES = {
  CREATE_SURVEY: "/survey",
  GET_SURVEYS: "/survey",
  GET_SURVEY_BY_ID: (id: string) => `/survey/${id}`,
};