import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <>
            <main className='container items-center mx-auto md:grid md:grid-cols-2 mt-12 gap-12 p-2'>

                <Outlet />
            </main>
        </>
    )
}

export default AuthLayout
