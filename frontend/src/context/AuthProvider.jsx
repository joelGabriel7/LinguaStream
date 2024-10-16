import { useState, useEffect, createContext } from 'react';
import client from '../config/axios';
import Tostify from '../components/Tostify';


const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [alert, setAlert] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const authenticatedUser = async () => {
            const token = localStorage.getItem('access_token_LSAI')
            if (!token) {
                setLoading(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {

                const { data } = await client('/user/me', config)
                setAuth(data)
            } catch (error) {
                setAlert({
                    text: error.response.data.detail,
                    error: true
                });
                setAuth({})
            }
            setLoading(false)
        }
        authenticatedUser()
    }, [])

    return (

        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading
            }}
        >
            {children}
            {alert && <Tostify message={alert} />}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext