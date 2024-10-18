import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import client from '../config/axios';
import { useToast } from "@/hooks/use-toast";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Repeatpassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast(); // Desestructura el toast desde useToast

    const handlerSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de campos
        if ([name, email, password, Repeatpassword].includes('')) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Fields required",
                duration: 3000
            });
            return;
        }

        if (password !== Repeatpassword) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Password don't match",
                duration: 3000
            });
            return;
        }

        // Request to endpoint
        const data = { name, email, password };
        try {
            await client.post(`/auth/users/`, data);
            toast({
                variant: "default",
                title: "Success",
                description: "Account created successfully",
                duration: 3000
            });

            setTimeout(() => {
                navigate('/');
            }, 4000);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.detail,
                duration: 3000
            });
        }
    };

    return (
        <>

            <div>
                <h1 className="text-indigo-600 font-black  text-5xl font-monserrat">
                    Explore new linguistic horizons with <span className='text-black'>LinguaStreamAI</span></h1>
            </div>

            <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-lg bg-white" >
                <form onSubmit={handlerSubmit}>
                    <p className="text-indigo-600 font-black  text-5xl font-monserrat">
                        Sign Up  <span className='text-black'>LinguaStreamAI</span></p>

                    <div className="my-5">


                        <label htmlFor=""
                            className='text-gray-600 font-monserrat block text-xl font-bold'
                        >
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder='Name'
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
                            Repeat Password
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
                        value='Create Account'
                        className="bg-indigo-700 font-monserrat w-full p-3 px-10 rounded-xl text-white uppercase font-bold hover:cursor-pointer 
                        hover:bg-indigo-800 md:w-auto"
                    />
                </form>

                <div className="mt-5 lg:flex lg:justify-between">
                    <Link
                        className='block text-center  font-monserrat my-5 text-gray-500'
                        to="/">Do you have account? <span className='text-indigo-300 font-bold'>Sign in</span></Link>

                </div>
            </div>

        </>
    )
}

export default Register