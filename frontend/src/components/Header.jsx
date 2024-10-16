import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth";
const Header = () => {
    const { logout } = useAuth()
    return (
        <>
            <header className="py-10 bg-indigo-600">
                <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">

                    <h1 className="text-center font-bold font-monserrat text-2xl text-indigo-200"> <span className="text-white font-black">LinguaStreamAI</span> – Your Multilingual ChatBot Solution</h1>

                    <nav className="flex  flex-col items-center lg:flex-row gap-4 mt-5 lg:mt-0 ">
                        <Link to={"/profile"} className="text-white text-sm font-bold uppercase font-monserrat">User profile</Link>

                        <button
                            type="button"
                            className="text-white text-sm font-bold uppercase font-monserrat"
                            onClick={logout}
                        >Logout</button>

                    </nav>
                </div>

            </header>
        </>
    )
}

export default Header