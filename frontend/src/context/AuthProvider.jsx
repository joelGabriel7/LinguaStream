import { useState, useEffect, createContext } from 'react';
import client from '../config/axios';
import Tostify from '../components/Tostify';


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
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
                setAuth({
                    access_token: token,
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
                console.log({
                    access_token: token,
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
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
    console.log('Se salio del UseEffect')
    const logout = () => {
        localStorage.removeItem('access_token_LSAI')
        setAuth({})
    }

    return (

        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                logout,
            }}
        >
            {children}
            {alert && <Tostify message={alert} />}
        </AuthContext.Provider>
    )
}

