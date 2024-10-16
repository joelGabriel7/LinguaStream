import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'
import Tostify from '../components/Tostify'
import client from '../config/axios'



const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState({})
    const navigate = useNavigate()
    const {  setAuth } = useAuth()


    const handleSubmit = async e => {
        e.preventDefault();

        const fields = [email, password].includes('')
        if (fields) {
            setAlert({
                text: 'Todos los campos son necesarios',
                error: true
            });
            return
        }

        // Request to endpoint
        try {
            const value = new URLSearchParams({
                username: email,
                password
            });
            const { data } = await client.post('/auth/token/', value)
            localStorage.setItem("access_token_LSAI", data.access_token)
            setAuth({access_token: data.access_token})
            navigate('/admin')
        } catch (error) {
            setAlert({
                text: error.response.data.message,
                error: true
            });
        }
    }



    return (
        <>
            <div>
                <h1 className="text-indigo-600 font-black text-6xl font-monserrat">
                    Conéctate con el mundo a través de <span className='text-black'>LinguaStreamAI</span></h1>
            </div>
            <div className="mt-20 md:mt-5 shadow-lg px-6 py-10 rounded-lg bg-white ">
                <form onSubmit={handleSubmit}>
                    <p className="text-indigo-600 font-black  text-6xl font-monserrat">
                        Inicia Sesión en  <span className='text-black'>LinguaStreamAI</span></p>
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
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
            {alert && <Tostify message={alert} />}
        </>
    )
}

export default Login
