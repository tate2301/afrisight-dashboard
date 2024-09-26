import React, { useContext, useState } from "react";
import Button from "../components/buttons/CustomButton";
import axios from "axios";
import { apiUrl } from "../utils/apiUrl";
import AlertMessage from "../components/alerts/AlertMessage";
import { getMessage } from "../helpers/getMessage";
import { Store } from "../context/Store";
import { useRouter } from "next/router";
import CXMappersHeader from "@/components/page-header/CXMappersHeader";
import Link from "next/link";
import { setAccessTokenToCookies, setRefreshTokenToCookies } from "@/hooks/cookies";
import { useAuth } from "@/context/AuthContext";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const { dispatch } = useContext<any>(Store);
  const router = useRouter();
  const { login } = useAuth();

  const loginToDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiUrl}/auth/login/email`, {
        email: username,
        password,
      });
      const { accessToken, refreshToken, ...userInfo } = data;

      await setAccessTokenToCookies(accessToken);
      await setRefreshTokenToCookies(refreshToken);

      if (userInfo.role === "ADMIN") {
        await login(accessToken, refreshToken);
        router.push("/gigs");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.status === 400) {
          setErr("Invalid email or password");
        } else {
          setErr(getMessage(error));
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
      <CXMappersHeader subtitle="Business Portal" />
      <div className="p-4 md:p-0 max-w-sm mx-auto w-full flex flex-col space-y-6">
        <h3 className="text-lg text-zinc-900 font-bold">
          Sign in
        </h3>
        <div className="flex flex-col space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-zinc-500">
            Email
          </label>
          <input
            type="email"
            placeholder="username"
            className="border border-zinc-400/10 py-2 px-4 rounded-xl pressable-shadow"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-zinc-500">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            className="border border-zinc-400/10 py-2 px-4 rounded-xl pressable-shadow"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="font-medium text-indigo-600">
            Forgot password?
          </Link>
        </div>
        {err && <AlertMessage type="error" text={err.toString()} />}
        {msg && <AlertMessage type="success" text={msg.toString()} />}
        <Button
          text="Sign in"
          onClick={loginToDashboard}
          loading={loading}
        />
      </div>
    </div >
  );
}

export default Home;
