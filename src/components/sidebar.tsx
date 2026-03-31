"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Users,
	Target,
	CheckSquare,
	BarChart3,
	ScrollText,
	Settings,
	Shield,
	LogOut,
	Menu,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const NAV_ITEMS = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
		permission: "view_dashboard",
	},
	{ label: "Users", href: "/users", icon: Users, permission: "view_users" },
	{ label: "Leads", href: "/leads", icon: Target, permission: "view_leads" },
	{
		label: "Tasks",
		href: "/tasks",
		icon: CheckSquare,
		permission: "view_tasks",
	},
	{
		label: "Reports",
		href: "/reports",
		icon: BarChart3,
		permission: "view_reports",
	},
	{
		label: "Audit Logs",
		href: "/audit",
		icon: ScrollText,
		permission: "view_audit",
	},
	{
		label: "Settings",
		href: "/settings",
		icon: Settings,
		permission: "manage_settings",
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const { user, hasPermission, logout } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);

	const filteredItems = NAV_ITEMS.filter((item) =>
		hasPermission(item.permission),
	);

	const navContent = (
		<div className="flex flex-col h-full">
			<div className="flex items-center gap-2 px-6 py-5 border-b border-orange-100">
				<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
					<Shield className="h-5 w-5 text-white" />
				</div>
				<div>
					<span className="text-sm font-bold">Admin workspace</span>
					<p className="text-xs text-muted-foreground">{user?.email}</p>
				</div>
			</div>

			<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				{filteredItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
							)}
						>
							<item.icon className="h-4 w-4" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-orange-100 p-4">
				<div className="flex items-center gap-3 px-3 py-2 mb-2">
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-sm font-semibold text-white">
						{user?.name?.charAt(0) || "U"}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium truncate">{user?.name}</p>
						<p className="text-xs text-muted-foreground truncate">
							{user?.role}
						</p>
					</div>
				</div>
				<Button
					variant="ghost"
					className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600 hover:bg-red-50"
					onClick={logout}
				>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{/* Mobile toggle */}
			<Button
				variant="ghost"
				size="icon"
				className="fixed top-4 left-4 z-50 lg:hidden"
				onClick={() => setMobileOpen(!mobileOpen)}
			>
				{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
			</Button>

			{/* Mobile overlay */}
			{mobileOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setMobileOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform lg:translate-x-0 lg:static lg:z-auto",
					mobileOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				{navContent}
			</aside>
		</>
	);
}
