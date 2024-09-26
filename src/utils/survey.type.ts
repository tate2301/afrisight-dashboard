type ObjectId = string;

// User interface (simplified for survey context)
interface IUser extends Document {
	_id: ObjectId;
	username: string;
	email: string;
	role: string;
}

// Form interface (simplified for survey context)
interface IForm extends Document {
	_id: ObjectId;
	name: string;
	sections: string;
	createdBy: ObjectId;
}

// RewardPolicy interface (simplified for survey context)
interface IRewardPolicy extends Document {
	_id: ObjectId;
	name: string;
	dollarValue: number;
	pointsValue: number;
}

// SurveyStatus enum
enum SurveyStatus {
	DRAFT = 'DRAFT',
	ACTIVE = 'ACTIVE',
	PAUSED = 'PAUSED',
	COMPLETED = 'COMPLETED',
}

// Base Survey interface
interface ISurveyBase extends Document {
	name: string;
	description: string;
	difficulty: string;
	category: string;
	formId?: string;
	duration: string;
	coverImage?: string;
	status: SurveyStatus;
	views: number;
	createdAt: Date;
	updatedAt: Date;
	startDate: Date;
	endDate: Date;
	dollarRewardValue: number;
	targetParticipants: number;
	completedParticipants: number;
}

// Survey interface with references
export interface ISurvey extends ISurveyBase {
	form: ObjectId | IForm;
	client?: ObjectId | IUser;
	rewardPolicy: ObjectId | IRewardPolicy;
}

// Utility type for populated fields
type Populated<T, K extends keyof T> = Omit<T, K> & {
	[P in K]: T[P] extends ObjectId ? NonNullable<T[P]> : T[P];
};

// Fully populated Survey type
type FullyPopulatedSurvey = Populated<
	ISurvey,
	'form' | 'client' | 'rewardPolicy'
>;

// Partially populated Survey type
type PartiallyPopulatedSurvey =
	| Populated<ISurvey, 'form'>
	| Populated<ISurvey, 'client'>
	| Populated<ISurvey, 'rewardPolicy'>;

// Comprehensive Survey type
export type ComprehensiveSurvey<
	T extends 'full' | 'partial' | 'none' = 'none',
> = T extends 'full'
	? FullyPopulatedSurvey
	: T extends 'partial'
		? PartiallyPopulatedSurvey
		: ISurvey;

// Type guard functions
export const isFullyPopulated = (
	survey: ComprehensiveSurvey<any>,
): survey is FullyPopulatedSurvey => {
	return (
		typeof survey.form === 'object' &&
		(survey.client ? typeof survey.client === 'object' : true) &&
		typeof survey.rewardPolicy === 'object'
	);
};

export const isPartiallyPopulated = (
	survey: ComprehensiveSurvey<any>,
): survey is PartiallyPopulatedSurvey => {
	return (
		typeof survey.form === 'object' ||
		(survey.client && typeof survey.client === 'object') ||
		typeof survey.rewardPolicy === 'object'
	);
};
