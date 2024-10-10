import {useState, useCallback} from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Select from '@radix-ui/react-select';
import {Filter as FilterIcon, X} from 'lucide-react';
import {FilterOperator, FilterState} from '@/utils/types';

export interface FilterConfig {
	type: 'text' | 'number' | 'select' | 'date';
	label: string;
	operators?: FilterOperator[];
	options?: {label: string; value: any}[];
}

export interface FilterConfigMap {
	[key: string]: FilterConfig;
}

export function useFilter(config: FilterConfigMap) {
	const [filters, setFilters] = useState<FilterState>({});

	const addFilter = useCallback(
		(
			field: string,
			operator: FilterOperator,
			value: any,
			additionalValue?: any,
		) => {
			setFilters((current) => ({
				...current,
				[field]: {operator, value, additionalValue},
			}));
		},
		[],
	);

	const removeFilter = useCallback((field: string) => {
		setFilters((current) => {
			const {[field]: removed, ...rest} = current;
			return rest;
		});
	}, []);

	const clearFilters = useCallback(() => {
		setFilters({});
	}, []);

	const FilterButton = useCallback(
		({field}: {field: string}) => {
			const fieldConfig = config[field];
			const currentFilter = filters[field];

			const getOperatorOptions = () => {
				if (fieldConfig.operators) return fieldConfig.operators;

				switch (fieldConfig.type) {
					case 'text':
						return ['eq', 'contains'] as FilterOperator[];
					case 'number':
					case 'date':
						return [
							'eq',
							'gt',
							'gte',
							'lt',
							'lte',
							'between',
						] as FilterOperator[];
					case 'select':
						return ['eq', 'neq'] as FilterOperator[];
					default:
						return ['eq'] as FilterOperator[];
				}
			};

			const renderOperatorLabel = (operator: FilterOperator) => {
				switch (operator) {
					case 'eq':
						return 'Equals';
					case 'neq':
						return 'Not equals';
					case 'gt':
						return 'Greater than';
					case 'gte':
						return 'Greater than or equal';
					case 'lt':
						return 'Less than';
					case 'lte':
						return 'Less than or equal';
					case 'contains':
						return 'Contains';
					case 'between':
						return 'Between';
					default:
						return operator;
				}
			};

			const renderValueInput = (operator: FilterOperator) => {
				switch (fieldConfig.type) {
					case 'select':
						return (
							<Select.Root
								value={currentFilter?.value}
								onValueChange={(value) => addFilter(field, operator, value)}>
								<Select.Trigger className="inline-flex items-center gap-1 px-2 py-1 border rounded">
									<Select.Value placeholder="Select value..." />
								</Select.Trigger>
								<Select.Portal>
									<Select.Content className="bg-white rounded-md shadow-lg">
										<Select.Viewport className="p-1">
											{fieldConfig.options?.map((option) => (
												<Select.Item
													key={option.value}
													value={option.value}
													className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer">
													{option.label}
												</Select.Item>
											))}
										</Select.Viewport>
									</Select.Content>
								</Select.Portal>
							</Select.Root>
						);

					case 'number':
						return operator === 'between' ? (
							<div className="flex items-center gap-2">
								<input
									type="number"
									className="w-24 px-2 py-1 border rounded"
									value={currentFilter?.value || ''}
									onChange={(e) =>
										addFilter(
											field,
											operator,
											e.target.value,
											currentFilter?.additionalValue,
										)
									}
									placeholder="Min"
								/>
								<span>and</span>
								<input
									type="number"
									className="w-24 px-2 py-1 border rounded"
									value={currentFilter?.additionalValue || ''}
									onChange={(e) =>
										addFilter(
											field,
											operator,
											currentFilter?.value,
											e.target.value,
										)
									}
									placeholder="Max"
								/>
							</div>
						) : (
							<input
								type="number"
								className="w-full px-2 py-1 border rounded"
								value={currentFilter?.value || ''}
								onChange={(e) => addFilter(field, operator, e.target.value)}
							/>
						);

					default:
						return (
							<input
								type="text"
								className="w-full px-2 py-1 border rounded"
								value={currentFilter?.value || ''}
								onChange={(e) => addFilter(field, operator, e.target.value)}
							/>
						);
				}
			};

			return (
				<Popover.Root>
					<Popover.Trigger asChild>
						<button
							className={`
            inline-flex items-center gap-1 px-2 py-1 rounded
            ${currentFilter ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}
          `}>
							<FilterIcon className="h-4 w-4" />
							{fieldConfig.label}
							{currentFilter && (
								<X
									className="h-4 w-4 hover:text-red-500"
									onClick={(e) => {
										e.stopPropagation();
										removeFilter(field);
									}}
								/>
							)}
						</button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content className="bg-white rounded-md shadow-lg p-4 w-72 z-50">
							<div className="space-y-4">
								<Select.Root
									value={currentFilter?.operator}
									onValueChange={(operator) =>
										addFilter(
											field,
											operator as FilterOperator,
											currentFilter?.value,
										)
									}>
									<Select.Trigger className="inline-flex items-center gap-1 px-2 py-1 border rounded w-full">
										<Select.Value placeholder="Select operator..." />
									</Select.Trigger>
									<Select.Portal>
										<Select.Content className="bg-white rounded-md shadow-lg z-50">
											<Select.Viewport className="p-1">
												{getOperatorOptions().map((operator) => (
													<Select.Item
														key={operator}
														value={operator}
														className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer">
														{renderOperatorLabel(operator)}
													</Select.Item>
												))}
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>

								{currentFilter?.operator &&
									renderValueInput(currentFilter.operator)}
							</div>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
			);
		},
		[filters, config, addFilter, removeFilter],
	);

	const getFilterQuery = useCallback(() => {
		return Object.entries(filters).reduce((acc, [field, filter]) => {
			if (filter.operator === 'between' && filter.additionalValue) {
				return {
					...acc,
					[`min${field}`]: filter.value,
					[`max${field}`]: filter.additionalValue,
				};
			}

			return {
				...acc,
				[field]: filter.value,
			};
		}, {});
	}, [filters]);

	return {
		filters,
		setFilters,
		addFilter,
		removeFilter,
		clearFilters,
		FilterButton,
		getFilterQuery,
	};
}
