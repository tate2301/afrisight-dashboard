import {
	Avatar,
	Button,
	Dialog,
	Flex,
	Text as RText,
	TextField,
} from '@radix-ui/themes';
import Box from '../design-sytem/box';
import {CameraIcon} from '@heroicons/react/24/outline';
import styled from '../design-sytem/theme';
import {AddModalProp} from './create-client';
import {Paragraph} from '../design-sytem/typography';
import Spinner from '../spinner/Spinner';
import {useEffect, useId, useRef} from 'react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import apiClient from '@/hooks/useApiFetcher';
import {AUTH_ROUTES} from '@/lib/api-routes';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {TeamMember} from '../icons/team.member';

const Text = styled(Paragraph, {});

const validationSchema = Yup.object({
	email: Yup.string().required('Email is required'),
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	password: Yup.string().required('Password is required'),
});

const AddUser = ({trigger, callback}: AddModalProp) => {
	const id = useId();
	const closeDialogRef = useRef<HTMLButtonElement>(null);
	const queryClient = useQueryClient();

	const addClientMutation = useMutation({
		mutationFn: async (values: any) => {
			const formData = new FormData();
			formData.append('profilePic', values.profilePic);
			formData.append('email', values.email);
			formData.append('firstName', values.firstName);
			formData.append('lastName', values.lastName);
			formData.append('role', 'ADMIN');
			formData.append('password', values.password);
			return apiClient.post(AUTH_ROUTES.CREATE_USER, formData);
		},
		onSuccess: (data) => {
			if (callback) {
				callback(data._id);
			}
			queryClient.invalidateQueries({queryKey: ['users']});
			onClose();
		},
	});

	const formik = useFormik({
		initialValues: {
			profilePic: null,
			email: '',
			firstName: '',
			lastName: '',
			password: '',
		},
		validationSchema,
		onSubmit: (values) => addClientMutation.mutate(values),
	});

	const onClose = () => {
		closeDialogRef.current?.click();
	};

	const generatePassword = () => {
		const password = Math.random().toString(36).substring(2, 15);
		formik.setFieldValue('password', password);
	};

	useEffect(() => {
		return () => {
			formik.resetForm();
		};
	}, []);

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				{trigger ? (
					trigger
				) : (
					<Button>
						<TeamMember className="size-5" /> Add team member
					</Button>
				)}
			</Dialog.Trigger>

			<Dialog.Content maxWidth="450px">
				<Dialog.Title>Add team member</Dialog.Title>
				<Dialog.Description
					size="2"
					mb="8">
					Add a new administrator to the platform.
				</Dialog.Description>

				<form
					autoComplete="off"
					onSubmit={formik.handleSubmit}>
					<Flex
						justify={'center'}
						gap={'4'}
						mb={'6'}>
						<label
							htmlFor="avatar-upload"
							className="cursor-pointer relative">
							<input
								id="avatar-upload"
								name="profilePic"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										formik.setFieldValue('profilePic', file);
									}
								}}
							/>
							<Avatar
								size="8"
								src={
									formik.values.profilePic
										? URL.createObjectURL(formik.values.profilePic)
										: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop'
								}
								fallback="A"
								className="hover:opacity-80 transition-opacity"
							/>
							<Box
								css={{backgroundColor: '$gray8'}}
								className="absolute -bottom-2 border-4 border-white -right-4 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center">
								<CameraIcon className="w-4 h-4" />
							</Box>
						</label>
					</Flex>
					<Flex
						direction="column"
						gap="3">
						<Flex gap={'4'}>
							<label>
								<Text weight="bold">First Name</Text>
								<TextField.Root
									name="firstName"
									autoComplete="off"
									value={formik.values.firstName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</label>
							<label>
								<Text weight="bold">Surname</Text>
								<TextField.Root
									name="lastName"
									autoComplete="off"
									value={formik.values.lastName}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</label>
						</Flex>
						<label>
							<Text weight="bold">Email</Text>
							<TextField.Root
								name="email"
								autoComplete="off"
								value={formik.values.email}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</label>
						<div>
							<label>
								<Text weight="bold">Password</Text>
								<TextField.Root
									name="password"
									autoComplete="off"
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									type={'password'}
								/>
							</label>
							<Button
								type="button"
								onClick={generatePassword}
								size={'1'}
								variant={'ghost'}>
								Generate password
							</Button>
						</div>
					</Flex>

					<Flex
						gap="3"
						mt="4"
						justify="end">
						<Dialog.Close ref={closeDialogRef}>
							<Button
								variant="soft"
								color={'gray'}>
								Cancel
							</Button>
						</Dialog.Close>
						<Button
							loading={addClientMutation.isPending}
							disabled={addClientMutation.isPending || !formik.isValid}
							type="submit"
							variant={'solid'}>
							{addClientMutation.isPending ? (
								<>
									<Spinner /> Adding...
								</>
							) : (
								'Add team member'
							)}
						</Button>
					</Flex>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	);
};

export default AddUser;
