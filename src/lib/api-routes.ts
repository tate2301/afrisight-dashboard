export const AUTH_ROUTES = {
	REFRESH_TOKEN: '/auth/token/refresh',
	USER_OBJECT: '/auth/profile',
	USER_PROFILE: '/profile',
	LOGIN: '/auth/login/email',
	CREATE_USER: '/auth/register/email',
	PROFILE: '/profile/me',
};

export const USER_ROUTES = {
	GET_ALL_USERS: '/profile',
	GET_USER_BY_ID: (id: string) => `/profile/${id}`,
	GET_CLIENTS: '/admin/client',
};

export const VOUCHER_ROUTES = {
	CREATE_VOUCHER: '/voucher',
	GET_ALL_VOUCHERS: '/voucher',
};

export const GAMIFICATION_ROUTES = {
	GET_REWARDS: '/gamification/rewards',
	ADD_STORE_ITEM: '/gamification/store/item',
	GET_STORE_ITEMS: '/gamification/store',
};

export const SURVEY_ROUTES = {
	CREATE_SURVEY: '/survey',
	GET_SURVEYS: '/survey',
	GET_SURVEY_BY_ID: (id: string) => `/survey/${id}`,
	GET_RESPONSES_BY_SURVEY_ID: (id: string) => `/survey/${id}/response`,
};

export const FORM_ROUTES = {
	CREATE: '/form',
	UPDATE: (id: string) => `/form/${id}`,
	GET_FORM_BY_ID: (id: string) => `/form/${id}`,
	GET_FORMS_FOR_USER_BY_ID: (id: string) => `/form/user/${id}/forms`,
};
