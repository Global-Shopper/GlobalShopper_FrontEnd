import { CustomerSidebar } from "@/components/CustomerSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const AccountCenterLayout = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 relative">
				<SidebarProvider>
					<div className="w-60 flex-shrink-0 border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30 backdrop-blur-md shadow-sm">
						<CustomerSidebar />
					</div>
					<main className="flex-1 p-6 overflow-y-auto">
						<div className="md:hidden mb-4">
							<SidebarTrigger />
						</div>
						<Outlet />
					</main>
				</SidebarProvider>
			</div>
			<Footer />
		</div>
	);
};

export default AccountCenterLayout;
