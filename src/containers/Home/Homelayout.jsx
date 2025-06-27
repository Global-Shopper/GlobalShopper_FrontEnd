import Header from '@/components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Homelayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Homelayout