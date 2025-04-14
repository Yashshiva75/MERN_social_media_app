import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Navigate, Route,Routes} from 'react-router-dom'
import HomePage from './Pages/Home/HomePage'
import LoginPage from './Pages/Auth/Login/LoginPage'
import SignUpPage from './Pages/Auth/Signup/SignUpPage'
import Sidebar from './Components/Common/Sidebar'
import RightPanel from './Components/common/RightPanel'
import NotificationPage from './Pages/notification/NotificationPage'
import ProfilePage from './Pages/profile/ProfilePage'
import {QueryClient,QueryClientProvider, useQuery, useQueryClient} from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner'
function App() {
  const queryClient = useQueryClient();

  const {data:authUser,isLoading,isError,error} = useQuery({
    queryKey:["authUser"],
    queryFn:async()=>{
      
      try{
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if(data.error) return null
        if(!res.ok) throw new Error(data.error || "something worng")
          queryClient.setQueryData(['authUser'],data)
        return data
      }catch(error){
        throw new Error(error)
      }
    },
    retry:false
  })
  if(isLoading){
    return (
      <div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
    )
  }
   console.log("auth",authUser)
  return (

    <>
    <div className='flex max-w-6xl mx-auto'>
    {authUser && <Sidebar/>}
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationPage/> : <Navigate to="/login"/>}/>
        <Route path="/profile/:userName" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
    </>
  )
}

export default App
