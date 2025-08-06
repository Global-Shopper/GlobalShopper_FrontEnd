import { BusinessSidebar } from '@/components/BusinessSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const BusinessManagerLayout = () => {
  return (
    <SidebarProvider className="flex w-full min-h-screen">
    <BusinessSidebar />
    <main className="flex flex-col flex-1 w-full min-h-screen">
      <Outlet />
    </main>
  </SidebarProvider>
  )
}

export default BusinessManagerLayout