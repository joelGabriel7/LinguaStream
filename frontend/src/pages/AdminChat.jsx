import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {  useToast } from "@/hooks/use-toast"


import useAuth from "@/hooks/useAuth";

const AdminChat = () => {
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState('')
    const [preferencesSet, setPreferencesSet] = useState(false)
    const location = useLocation()
    const { alert } = location.state || {}
    const { auth } = useAuth()
    const { toast } = useToast()

    useEffect(() => {

        if (auth?.preferences?.source_language && auth?.preferences?.target_language) {
            setPreferencesSet(true);
        } else {
            setPreferencesSet(false);
            setShowAlert(true)
        }

        if (alert) {
            setShowAlert(true)
            const timer = setTimeout(() => setShowAlert(false), 15000);
            return () => clearTimeout(timer)
        }

    }, [auth,alert])


    const handlerSubmit = async e => {
        e.preventDefault();
        if (!message.trim()) {
            toast({
                variant: "destructive",
                title: "Message cannot be empty",
                description: "Please enter a message before sending",
                duration: 3000
            })
        }
    }


    return (
        <div className="flex flex-col h-screen justify-center items-center p-4">

            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 text-center font-bold rounded-lg shadow-lg w-full  max-w-5xl">
                <h1>LingueStreamAI</h1>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-auto p-4 border border-indigo-300 rounded-lg shadow-lg bg-white w-full max-w-5xl mt-4">


                <div className="mb-4">

                    {/* Alert */}
                    {showAlert && !preferencesSet && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle> {'Aviso!'} </AlertTitle>
                            <AlertDescription>{alert.text}</AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Messages Area */}
                <div className="space-y-4">
                    {/* Example Messages */}
                    <div className="flex">
                        <div className="bg-indigo-500 text-white p-3 rounded-lg max-w-xs">
                            Hello! How can I assist you today?
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-gray-300 text-gray-800 p-3 rounded-lg max-w-xs">
                            I need help with my account.
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-indigo-300 rounded-lg shadow-lg w-full max-w-5xl mt-2">

                <form onSubmit={handlerSubmit}>

                    <div className="flex">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            placeholder="Type your message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        <button disabled={!preferencesSet} className="bg-indigo-600 text-white rounded-lg px-4 hover:bg-indigo-700">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminChat;
