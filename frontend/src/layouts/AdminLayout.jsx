import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";



const AdminLayout = () => {
    const { auth, loading } = useAuth();
    return (
        <>
            <h1>Admin Layout</h1>


            {auth ? <Outlet /> : <Navigate to={"/"} />}
        </>
    )
}

export default AdminLayout