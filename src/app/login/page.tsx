"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(email, password);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.response?.data?.message || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Panel - Branding */}
			<div
				className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white flex-col justify-between p-12"
				style={{
					background:
						"linear-gradient(135deg, #f97316 0%, #ea580c 30%, #dc2626 60%, #9a3412 100%)",
				}}
			>
				{/* Decorative wave shapes */}
				<svg
					className="absolute inset-0 w-full h-full opacity-20"
					viewBox="0 0 600 800"
					preserveAspectRatio="none"
				>
					<path
						d="M0,400 Q150,300 300,400 T600,400 L600,800 L0,800Z"
						fill="rgba(255,255,255,0.15)"
					/>
					<path
						d="M0,500 Q150,400 300,500 T600,500 L600,800 L0,800Z"
						fill="rgba(255,255,255,0.1)"
					/>
					<path
						d="M0,600 Q150,500 300,600 T600,600 L600,800 L0,800Z"
						fill="rgba(255,255,255,0.08)"
					/>
				</svg>

				<div className="relative z-10 flex items-center gap-3">
					<Shield className="h-8 w-8" />
					<span className="text-xl font-bold">RBAC System</span>
				</div>
				<div className="relative z-10">
					<h1 className="text-4xl font-bold mb-4">
						Dynamic Permission-Based Access Control
					</h1>
					<p className="text-orange-100 text-lg">
						Manage users, roles, and granular permissions with a modern, secure
						dashboard.
					</p>
				</div>
				<p className="relative z-10 text-orange-200 text-sm">
					&copy; {new Date().getFullYear()} RBAC System. All rights reserved.
				</p>
			</div>

			{/* Right Panel - Login Form */}
			<div className="flex-1 flex items-center justify-center p-8 bg-background">
				<div className="w-full max-w-md space-y-8">
					<div className="lg:hidden flex items-center gap-2 justify-center mb-8">
						<Shield className="h-8 w-8 text-primary" />
						<span className="text-xl font-bold">RBAC System</span>
					</div>

					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
						<p className="text-muted-foreground mt-2">
							Sign in to your account to continue
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
								{error}
							</div>
						)}

						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email address
							</label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="email"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Password
							</label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="current-password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="bg-muted/50 rounded-lg p-4 space-y-2">
						<p className="text-xs font-medium text-muted-foreground">
							Demo Accounts:
						</p>
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span className="font-medium">Admin:</span> admin@example.com
							</div>
							<div>
								<span className="font-medium">Pass:</span> Admin@123
							</div>
							<div>
								<span className="font-medium">Manager:</span>{" "}
								manager@example.com
							</div>
							<div>
								<span className="font-medium">Pass:</span> Manager@123
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
