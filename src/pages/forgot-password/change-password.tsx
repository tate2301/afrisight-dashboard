import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import CXMappersHeader from "@/components/page-header/CXMappersHeader";
import { apiUrl } from "@/utils/apiUrl";
import AlertMessage from "@/components/alerts/AlertMessage";
import Button from "@/components/buttons/CustomButton";

function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [err, setErr] = useState("");
    const router = useRouter();
    const { token } = router.query;

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErr("Passwords do not match");
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
            // Redirect to login page after successful password change
            setTimeout(() => router.push("/login"), 3000);
        } catch (error: any) {
            setErr(error.response?.data || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full items-center justify-center content-center min-h-screen space-y-6 bg-white">
            <CXMappersHeader subtitle="Secure Portal" />
            <div className="max-w-sm mx-auto w-full flex flex-col space-y-6">
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
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className="text-xs font-medium text-zinc-500">
                            Should include a symbol, A-z and at least 8 characters.
                        </p>
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                {err && <AlertMessage type="error" text={err} />}
                {success && <AlertMessage type="success" text="Password changed successfully. Redirecting to login..." />}
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
