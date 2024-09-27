import React from 'react';
import Flex from '../design-sytem/flex';
import {Paragraph} from '../design-sytem/typography';
import {ChevronRight} from '../icons/chevron.right';
import Link from 'next/link';

const item_as_link = (item: string) => item.toLowerCase().replaceAll(' ', '-');

const composeItemHref = (items: string[], index: number) => {
	// Join all items up to the current index into a breadcrumb path
	return (
		'/' +
		items
			.slice(0, index + 1)
			.map(item_as_link)
			.join('/')
	);
};

const Breadcrumbs = (props: {items: string[]}) => {
	return (
		<Flex
			alignItems={'center'}
			css={{gap: 8}}>
			{props.items.map((item, index) => (
				<React.Fragment key={index}>
					<Link href={composeItemHref(props.items, index)}>
						<Paragraph
							color={index === props.items.length - 1 ? 'primary' : 'tertiary'}
							className="py-1 px-2 rounded-lg"
							css={{
								'&:hover': {backgroundColor: '$gray2'},
								backgroundColor:
									index === props.items.length - 1 ? '$gray2' : 'transparent',
							}}
							weight={'medium'}>
							{item}
						</Paragraph>
					</Link>
					{index !== props.items.length - 1 && (
						<Paragraph
							color="tertiary"
							className="size-4"
							weight={'medium'}>
							<ChevronRight />
						</Paragraph>
					)}
				</React.Fragment>
			))}
		</Flex>
	);
};
export default Breadcrumbs;
