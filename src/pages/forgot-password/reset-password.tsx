import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CXMappersHeader from "@/components/page-header/CXMappersHeader";
import { apiUrl } from "@/utils/apiUrl";
import AlertMessage from "@/components/alerts/AlertMessage";
import Button from "@/components/buttons/CustomButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const router = useRouter();
    const { token } = router.query;

    const validatePassword = (password: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        if (!validatePassword(newPassword)) {
            setErr("Password does not meet the requirements");
            return;
        }

        setLoading(true);
        setSuccess(false);
        setErr("");

        try {
            await axios.post(`${apiUrl}/auth/reset-password`, {
                token,
                newPassword,
            });
            setSuccess(true);
        } catch (error: any) {
            setErr(error.response ? error.response.data.message || "An error occurred. Please try again" : "An error occurred. Please try again");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setNewPassword(password);
        if (password && !validatePassword(password)) {
            setPasswordError("Password must include at least one letter, one number, one symbol, and be at least 8 characters long.");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPwd = e.target.value;
        setConfirmPassword(confirmPwd);
        if (confirmPwd !== newPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    if (success) {
        return (
            <div className=" w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
                <CXMappersHeader subtitle="Secure Portal" />
                <div className="p-4 md:p-0 max-w-sm mx-auto w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password Changed Successfully</CardTitle>
                            <CardDescription>Your password has been updated.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500">You can now close this page and log in with your new password.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
            <CXMappersHeader subtitle="Secure Portal" />
            <div className="p-4 md:p-0 max-w-sm mx-auto w-full flex flex-col space-y-6">
                <div>
                    <h3 className="text-lg text-zinc-900 font-bold">
                        Change Password
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Enter your new password below.
                    </p>
                </div>
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium text-zinc-500">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New password"
                            className="py-2 px-4 rounded-lg pressable-shadow"
                            value={newPassword}
                            onChange={handlePasswordChange}
                        />
                        {passwordError && <p className="text-xs font-medium text-red-500">{passwordError}</p>}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-500">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            className="py-2 px-4 rounded-lg pressable-shadow"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {confirmPasswordError && <p className="text-xs font-medium text-red-500">{confirmPasswordError}</p>}
                    </div>
                </div>
                {err && <AlertMessage type="error" text={err} />}
                <Button
                    text="Change password"
                    onClick={handleChangePassword}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default ChangePassword;
