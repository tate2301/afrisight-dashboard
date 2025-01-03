import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import CXMappersHeader from '@/components/page-header/CXMappersHeader';
import Link from 'next/link';
import { apiUrl } from '@/utils/apiUrl';
import AlertMessage from '@/components/alerts/AlertMessage';
import Button from '@/components/buttons/CustomButton';
import Head from 'next/head';

function Home() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [err, setErr] = useState('');
	const router = useRouter();

	const sendRecoveryEmail = async () => {
		setLoading(true);
		setSuccess(false);
		setErr('');

		try {
			const response = await axios.post(`${apiUrl}/auth/forgot-password`, {
				email: email,
			});

			if (response) {
				setSuccess(true);
			}
		} catch (error: any) {
			setErr(error.response);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className=" w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
			<Head>
				<title>Forgot Password</title>
			</Head>
			<CXMappersHeader subtitle="Secure Portal" />
			<div className="max-w-sm p-4 md:p-0 mx-auto w-full h-fit flex flex-col space-y-6">
				<div>
					<h3 className="text-lg text-zinc-900 font-medium">
						Forgot password?
					</h3>
					<p className="text-[13px] text-zinc-500">
						If you’ve forgotten your password, enter your email address below
						and we will email you further instructions.{' '}
					</p>
				</div>
				<div className="flex flex-col space-y-2">
					<label
						htmlFor="email"
						className="text-[13px] font-medium text-zinc-500">
						Email
					</label>
					<input
						type="email"
						name="email"
						placeholder="Email address"
						className=" py-2 px-4 rounded-lg pressable-shadow"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				{err && (
					<AlertMessage
						type="error"
						text={err.toString()}
					/>
				)}
				{success && (
					<AlertMessage
						type="success"
						text="Check your email for the recovery link"
					/>
				)}
				<Button
					text="Send recovery email"
					onClick={sendRecoveryEmail}
					loading={loading}
				/>
			</div>
		</div>
	);
}

export default Home;
