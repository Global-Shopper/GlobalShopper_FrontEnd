import setUpInterceptor from '@/services/baseRequest';
import { store } from '@/store/store';
import './App.css'
import { useEffect, useState } from 'react';
import AppRoutes from '@/routes/Routes';
import { Toaster } from 'sonner';
import { setGrabberExtensionDialogOpen } from '@/features/app';
import { useDispatch } from 'react-redux';
import GrabberExtensionDialog from '@/components/GrabberExtensionDialog';

// Set up API interceptor for handling disconnect and token expiration
setUpInterceptor(store);

function App() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  useEffect(() => {
    const listener = (event) => {
      if (event?.data?.type === "FROM_EXTENSION" && Array.isArray(event?.data?.products)) {
        console.log("Data From Extension: ", event.data.products)
        setProducts(event.data.products)
        dispatch(setGrabberExtensionDialogOpen(true))
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [dispatch]);
  
  return (
    <>
      <div className="App">
        <GrabberExtensionDialog items={products} />
        <AppRoutes />
        <Toaster richColors/>
      </div>
    </>
  )
}

export default App
