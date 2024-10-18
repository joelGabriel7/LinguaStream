import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";



export const AdminLayout = () => {
    const { auth, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
</div>;
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

