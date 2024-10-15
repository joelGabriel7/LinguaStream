import { Link } from 'react-router-dom'
import { useState } from 'react'
import client from '../config/axios'
import Tostify from '../components/Tostify'


const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [Repeatpassword, setRepeatPassword] = useState('')
    const [alert, setAlert] = useState({})


    const handlerSubmit = async e => {
        e.preventDefault()
        if ([name, email, password, Repeatpassword].includes('')) {
            console.log('')
            setAlert({
                text: 'Hay campos vacios',
                error: true
            })
            return
        }

        if (password !== Repeatpassword) {
            console.log('Password no coinciden')
            return
        }

    }

    return (
        <>
            <div>
                <h1 className="text-indigo-600 font-black  text-6xl font-monserrat">
                    Explora nuevos horizontes lingüísticos con <span className='text-black'>LinguaStream</span></h1>
            </div>

            <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-lg bg-white" >
                <form onSubmit={handlerSubmit}>
                    <p className="text-indigo-600 font-black  text-6xl font-monserrat">
                        Registrate en  <span className='text-black'>LinguaStream</span></p>

                    <div className="my-5">


                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Nombre
                        </label>

                        <input
                            type="text"
                            placeholder='Nombre'
                            className='border w-full font-monserrat p-3 mt-3 bg-gray-50 rounded-xl'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="my-5">
                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder='Email'
                            className='border w-full font-monserrat p-3 mt-3 bg-gray-50 rounded-xl'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="my-5">
                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder='Password'
                            className='border w-full font-monserrat p-3 mt-3 bg-gray-50 rounded-xl'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="my-5">
                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Repetir Password
                        </label>

                        <input
                            type="password"
                            placeholder='Repetir Password'
                            className='border w-full font-monserrat p-3 mt-3 bg-gray-50 rounded-xl'
                            value={Repeatpassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    <input
                        type="submit"
                        value='Crear Cuenta'
                        className="bg-indigo-700 font-monserrat w-full p-3 px-10 rounded-xl text-white uppercase font-bold hover:cursor-pointer 
                        hover:bg-indigo-800 md:w-auto"
                    />
                </form>

                <div className="mt-5 lg:flex lg:justify-between">
                    <Link
                        className='block text-center  font-monserrat my-5 text-gray-500'
                        to="/">tienes una cuenta? <span className='text-indigo-300 font-bold'>Inicia Sesión</span></Link>

                </div>
            </div>
            {alert && <Tostify message={alert} />}
        </>
    )
}

export default Register