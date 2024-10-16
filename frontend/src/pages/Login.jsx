import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {

    const { auth } = useAuth()
    console.log(auth)

    return (
        <>
            <div>
                <h1 className="text-indigo-600 font-black text-6xl font-monserrat">
                    Conéctate con el mundo a través de <span className='text-black'>LinguaStream</span></h1>
            </div>
            <div className="mt-20 md:mt-5 shadow-lg px-6 py-10 rounded-lg bg-white ">
                <form action="">
                    <p className="text-indigo-600 font-black  text-6xl font-monserrat">
                        Inicia Sesión en  <span className='text-black'>LinguaStream</span></p>
                    <div className='my-5' >

                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder='Email'
                            className='border w-full p-3 mt-3 font-monserrat bg-gray-50 rounded-xl'
                        />
                    </div>
                    <div className='my-5' >

                        <label htmlFor=""
                            className='text-gray-600  font-monserrat block text-xl font-bold'
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder='Password'
                            className='border w-full p-3 mt-3 font-monserrat bg-gray-50 rounded-xl'
                        />
                    </div>
                    <input
                        type="submit"
                        value="Iniciar Sesión"
                        className='bg-indigo-700 w-full font-monserrat p-3 px-10 rounded-xl text-white uppercase font-bold hover:cursor-pointer 
                        hover:bg-indigo-800 md:w-auto'
                    />
                </form>
                <nav className='mt-10 lg:flex lg:justify-between' >
                    <Link
                        className='block font-monserrat text-center my-5 text-gray-500'
                        to="/register">No tienes una cuenta? <span className='text-indigo-300 font-bold font-monserrat '>Registrate</span></Link>

                </nav>
            </div>
        </>
    )
}

export default Login
