export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const buildApiUrlWithParams = (
	url: string,
	params: Record<string, string | null>,
) => {
	// drop the null values and fix the types
	const cleanedParams = Object.fromEntries(
		Object.entries(params)
			.filter(([_, value]) => value !== null)
			.map(([key, value]) => [key, value as string]),
	);
	if (Object.keys(cleanedParams).length === 0) {
		return `${apiUrl}${url}`;
	}

	const urlParams = new URLSearchParams(cleanedParams);
	return `${apiUrl}${url}?${urlParams.toString()}`;
};
