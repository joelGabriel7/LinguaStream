import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";



export const AdminLayout = () => {
    const { auth, loading } = useAuth();
    if (loading) return '<h1>Cargando...<h1/>';
    return (
        <>
            <Header />
            {auth?.access_token ? (
                <main className="container mx-auto mt-10 max-w-screen-xl">
                    <Outlet />
                </main>
            ) : <Navigate to={"/"} />}
            <Footer />
        </>
    )
}

