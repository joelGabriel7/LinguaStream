import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";



export const AdminLayout = () => {
    const { auth, loading } = useAuth();
    if (loading) return '<h1>Cargando...<h1/>';
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                {auth?.access_token ? (
                    <main className="container mx-auto mt-10 max-w-screen-xl flex-1 ">
                        <Outlet />
                    </main>
                ) : <Navigate to={"/"} />}

                <Footer />
            </div>
        </>
    )
}

