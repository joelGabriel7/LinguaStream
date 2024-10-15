import { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Tostify = ({ message }) => {
    useEffect(() => {
        if (message.error) {
            toast.error(message.text)
        } else {
            toast.success(message.text)
        }
      }, [message])
      
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
            />

        </>
    )
}

export default Tostify