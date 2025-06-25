import { useSelector } from 'react-redux';
import setUpInterceptor from '@/services/baseRequest';
import { store } from '@/store/store';
import './App.css'
import { useEffect } from 'react';
import AppRoutes from '@/routes/Routes';
import { Toaster } from 'sonner';

// Set up API interceptor for handling disconnect and token expiration
setUpInterceptor(store);

function App() {
  const isOnline = useSelector((state) => state.rootReducer.app.onLineStatus);
  useEffect(() => {
    if (!isOnline) {
      //
    }
  }, [isOnline])
  
  return (
    <>
      <div className="App">
        <AppRoutes />
        <Toaster richColors/>
      </div>
    </>
  )
}

export default App
