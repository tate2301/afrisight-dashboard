import { RewardPolicy } from '@/pages/gigs';

export interface UserInfoTypes {
	id: number;
	username: string;
	email: string;
	otp: string | null;
	profilePic: string | null;
	name: string | null;
	role: 'ADMIN' | 'USER';
	createdAt: string;
	updatedAt: string;
	iat: number | null;
	exp: number | null;
}

export interface DashboardItemProps {
	link: string;
	name: string;
	createdAt: string;
	branch: string;
	status: string;
	Icon?: any;
	_id?: string | number;
}

export interface SectionType {
	id: number;
	options: Array<{ name: string; _id: string }>;
	type: {
		name: string;
		_id: string;
	};
	value: string;
}

export interface FormType {
	id: string;
	form: {
		description: string;
		name: string;
		sections: Array<SectionType>;
	};
}

export type TSurvey = {
	_id: string;
	name: string;
	description: string;
	reward: TReward;
	dollarRewardValue: number;
	targetParticipants: number;
	completedParticipants: number;
	difficulty: string;
	category: string;
	formId: string;
	form: string;
	duration: string;
	status: string;
	views: number;
	startDate: string;
	endDate: string;
	createdAt: string;
	updatedAt: string;
};

export type TReward = {
	_id: string;
	type: string;
	value: {
		amount: number;
		code?: string;
		maxRedemptions?: number;
		expiresAt?: string;
	};
};

type TVoucherDetails = {
	currency: string;
	validOutlets: string[];
	maxRedemptions: number;
};

export type TStoreItem = {
	voucherDetails: TVoucherDetails;
	_id: string;
	name: string;
	description: string;
	type: string;
	pointsCost: number;
	stock: number;
	maxRedemptionsPerUser: number;
	expiresAt: string;
	imageUrl: string;
	isActive: boolean;
	basePricePoints: number;
	currentPricePoints: number;
	demandMultiplier: number;
	isDeleted: boolean;
	lastPriceUpdate: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

export type ProfileType = 'ADMIN' | 'SUPPORT' | 'CLIENT' | 'PARTICIPANT';
export type UserRole = ProfileType;

export interface Profile {
	id: string;
	userId: string;
	profileType: ProfileType;
	name?: string;
	firstname?: string;
	surname?: string;
	profilePic?: string;
	metadata?: {
		gender?: 'male' | 'female' | 'other' | 'unknown';
		dateOfBirth?: Date;
		interests?: string[];
		education?: 'high_school' | 'bachelors' | 'masters' | 'phd';
		language?: 'en' | 'fr';
		weight?: number;
		occupation?: string;
		companyName?: string;
		monthlyIncome?: string;
		ethnicity?: string;
		hobbies?: string[];
		isHasChildren?: boolean;
		ifDrinksAlcohol?: boolean;
		ifSmokes?: boolean;
		ifExercises?: boolean;
	};
	userInventoryId?: string;
	isDeleted: boolean;
	deletedAt?: string;
	createdAt: string;
	updatedAt: string;
	user: User;
}

export interface TProfileUpdateInput {
	name?: string;
	firstname?: string;
	surname?: string;
	profilePic?: string;
	isHasChildren?: boolean;
	ifDrinksAlcohol?: boolean;
	ifSmokes?: boolean;
	ifExercises?: boolean;
	weight?: number;
	occupation?: string;
	companyName?: string;
	monthlyIncome?: number;
	education?: string;
	ethnicity?: string;
	hobbies?: string[];
}

export interface User {
	_id: string;
	id: string;
	username: string;
	email: string;
	role: UserRole;
	isEmailVerified: boolean;
	phoneNumber?: string;
	isPhoneVerified: boolean;
	isSocialConnectedUser: boolean;
	status: 'ACTIVE' | 'INACTIVE';
	createdAt: string;
	updatedAt: string;
}

export interface UserUpdateInput {
	username?: string;
	email?: string;
	phoneNumber?: string;
	role?: UserRole;
}

export interface UserRegistrationInput {
	username: string;
	email: string;
	password: string;
	role: UserRole;
	phoneNumber?: string;
}

export interface UserLoginInput {
	email: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
	refreshToken: string;
}

export interface Form {
	_id: string;
	id: string;
	description: string;
	name: string;
	sections: any[];
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export type PaginatedResponse<T> = {
	docs: T[];
	hasNextPage: boolean;
	hasPrevPage: boolean;
	limit: number;
	nextPage: number | null;
	page: number;
	pagingCounter: number;
	prevPage: number | null;
	totalDocs: number;
	totalPages: number;
};

export type SortDirection = 'asc' | 'desc';

export interface SortState {
	column: string;
	direction: SortDirection;
}

export type FilterOperator =
	| 'eq'
	| 'neq'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'contains'
	| 'between';

export interface FilterValue {
	operator: FilterOperator;
	value: any;
	additionalValue?: any; // For 'between' operator
}

export interface FilterState {
	[key: string]: FilterValue;
}

export type Gig = {
	name?: string;
	description: string;
	coverImage: string;
	difficulty: 'easy' | 'medium' | 'hard';
	dollarRewardValue: number;
	duration: number;
	startDate: string;
	endDate: string;
	status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
	targetParticipants: number;
	completedParticipants: number;
	views: number;
	rewardPolicy?: RewardPolicy;
	createdAt: string;
	updatedAt: string;
	questionOrdering: 'preserve' | 'shuffle';
	category: string;
	client: string;
	form: string;
	location: string;
	tags: string[];
	// TODO: Define submissions type
	gig_submissions: any[];
	targetAgeRange: { min: number; max: number };
	targetGender: 'Male' | 'Female' | 'Other' | 'All';
	languageRequirements: string[];
	educationLevel: string;
	incomeRange: { min: number; max: number };
	_id: string;
	__v: number;
};

export interface Country {
	id: string;
	name: string;
}

export interface City {
	id: string;
	name: string;
	country: Country;
	admin1: string;
	lat: string;
	lon: string;
	pop: string;
}

export interface Location {
	type: 'all' | 'country' | 'city';
	countries: string[];
	cities: Array<{
		country: string;
		_id: string;
	}>;
}
