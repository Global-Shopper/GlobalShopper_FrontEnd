import { CustomerSidebar } from '@/components/CustomerSidebar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AccountCenterLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SidebarProvider>
          <CustomerSidebar />
          <main className="p-6">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  )
}

export default AccountCenterLayout