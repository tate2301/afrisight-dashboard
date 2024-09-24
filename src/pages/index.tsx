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

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
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

      if (userInfo.role === "ADMIN") {
        setMsg(getMessage(data));
        dispatch({
          type: "USER_LOGIN",
          payload: {
            access_token: accessToken,
            refresh_token: refreshToken,
            userInfo,
          },
        });
        setErr("");
        setLoading(false);
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      setErr(getMessage(error));
      setMsg("");
      setLoading(false);
    }
  };

  return (
    <div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
      <CXMappersHeader subtitle="Business Portal" />
      <div className="max-w-sm mx-auto w-full flex flex-col space-y-6">
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
            className="border border-zinc-400/10 py-2 px-4 rounded-xl shadow-sm"
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
            className="border border-zinc-400/10 py-2 px-4 rounded-xl shadow-sm"
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
