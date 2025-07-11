import React from 'react'
import { Outlet } from 'react-router-dom'

const CreateRequestLayout = () => {
  return (
    <div className='p-0'><Outlet/></div>
  )
}

export default CreateRequestLayout