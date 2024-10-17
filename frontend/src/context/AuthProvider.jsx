import { useState, useEffect, createContext } from 'react';
import client from '../config/axios';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const authenticatedUser = async () => {
            const token = localStorage.getItem('access_token_LSAI')
            const preferences = JSON.parse(localStorage.getItem('user_preferences')) || {}
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
                    email: data.email,
                    preferences
                })

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast({
                        variant: "destructive",
                        title: "Session expired",
                        description: "Your session has expired. Please log in again.",
                        duration: 3000,
                    });
                }
                setAuth({})
            }
            setLoading(false)
        }
        authenticatedUser()
    }, [])
    const logout = () => {
        localStorage.removeItem('access_token_LSAI')
        setAuth({})
    }

    return (

        <>
            <AuthContext.Provider

                value={{
                    auth,
                    setAuth,
                    loading,
                    logout,
                }}
            >
                {children}
                <Toaster />
            </AuthContext.Provider>

        </>
    )
}

