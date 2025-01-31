import React, {FormEvent, useContext, useState} from 'react';
import axios from 'axios';
import {apiUrl} from '../utils/apiUrl';
import AlertMessage from '../components/alerts/AlertMessage';
import {getMessage} from '../helpers/getMessage';
import {Store} from '../context/Store';
import {useRouter} from 'next/router';
import CXMappersHeader from '@/components/page-header/CXMappersHeader';
import Link from 'next/link';
import {
	setAccessTokenToCookies,
	setRefreshTokenToCookies,
} from '@/hooks/cookies';
import {useAuth} from '@/context/AuthContext';
import {Button, TextField} from '@radix-ui/themes';

function Home() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState('');
	const [msg, setMsg] = useState('');
	const {dispatch} = useContext<any>(Store);
	const router = useRouter();
	const {login} = useAuth();

	const loginToDashboard = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const {data} = await axios.post(`${apiUrl}/auth/login/email`, {
				email: username,
				password,
			});
			const {accessToken, refreshToken, ...userInfo} = data;

			await setAccessTokenToCookies(accessToken);
			await setRefreshTokenToCookies(refreshToken);

			if (userInfo.role === 'ADMIN') {
				await login(accessToken, refreshToken);
				router.push('/gigs');
				return;
			}

			setErr('You are not authorized to access this application');
		} catch (error) {
			console.error(error);
			if (axios.isAxiosError(error)) {
				if (error.status === 400) {
					setErr('Invalid email or password');
				} else {
					console.log(error);
					setErr(error.response?.data.error);
				}
			}
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-[#F5F5F5]">
			<CXMappersHeader subtitle="Business Portal" />
			<form
				onSubmit={loginToDashboard}
				className="md:p-0 max-w-md mx-auto w-full flex flex-col space-y-6 bg-white rounded-xl overflow-hidden">
				<div className="inline-flex items-center gap-2 p-4 bg-[#FAFAFA]">
					<span className="material-symbols-rounded">corporate_fare</span>
					<h3 className="text-zinc-900 font-medium">Sign in to your account</h3>
				</div>
				<div className="p-4 space-y-6">
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="username"
							className="text-[13px] font-medium text-zinc-500">
							Email
						</label>
						<TextField.Root
							type="email"
							placeholder="username"
							variant="soft"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<label
							htmlFor="password"
							className="text-[13px] font-medium text-zinc-500 focus:border-[#007C7C]">
							Password
						</label>
						<TextField.Root
							type="password"
							variant="soft"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="flex justify-end">
						<Link
							href="/forgot-password"
							className="font-medium text-indigo-600">
							<Button
								variant="ghost"
								type="button"
								className="font-bold">
								Forgot password?
							</Button>
						</Link>
					</div>
					{err && (
						<AlertMessage
							type="error"
							text={err.toString()}
						/>
					)}
					{msg && (
						<AlertMessage
							type="success"
							text={msg.toString()}
						/>
					)}

					<Button
						style={{
							backgroundColor: '#007C7C',
							color: '#fff',
							height: '40px',
							fontWeight: 600,
							width: '100%',
						}}
						loading={loading}>
						Sign in
					</Button>
				</div>
			</form>
		</div>
	);
}

export default Home;
