import React, { useContext, useState } from 'react';
import CustomButton from '../components/buttons/CustomButton';
import axios from 'axios';
import { apiUrl } from '../utils/apiUrl';
import AlertMessage from '../components/alerts/AlertMessage';
import { getMessage } from '../helpers/getMessage';
import { Store } from '../context/Store';
import { useRouter } from 'next/router';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const { dispatch } = useContext<any>(Store);
  const router = useRouter();

  const loginToDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/auth/login/email`, {
        email: username,
        password,
      });
      const { accessToken, refreshToken, ...userInfo } = data;

      if (userInfo.role === 'ADMIN') {
        setMsg(getMessage(data));
        dispatch({
          type: 'USER_LOGIN',
          payload: {
            access_token: accessToken,
            refresh_token: refreshToken,
            userInfo,
          },
        });
        setErr('');
        setLoading(false);
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      }
      setErr('Not allowed');
      setMsg('');
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErr(getMessage(error));
      setMsg('');
      setLoading(false);
    }
  };

  return (
    <div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-zinc-50">
      <div className="max-w-sm mx-auto w-full flex flex-col space-y-6 bg-white p-4 rounded-3xl border border-zinc-200/50">
        <p className="text-center text-zinc-900 font-bold">
          Login to dashboard
        </p>
        <input
          type="email"
          placeholder="username"
          className="border border-zinc-200/50 py-2 px-4 rounded-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border border-zinc-200/50 py-2 px-4 rounded-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs font-medium text-zinc-700 px-2">
          Forgot password?
        </p>
        {err && <AlertMessage type="error" text={err.toString()} />}
        {msg && <AlertMessage type="success" text={msg.toString()} />}
        <CustomButton
          text="Login"
          onClick={loginToDashboard}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Home;
