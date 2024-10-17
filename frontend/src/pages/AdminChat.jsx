import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import useAuth from "@/hooks/useAuth";



const AdminChat = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [preferencesSet, setPreferencesSet] = useState(false);
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const { alert } = location.state || {}
    const { auth } = useAuth();
    const { toast } = useToast();
    const ws = useRef(null)

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

    }, [auth, alert])
    useEffect(() => {
        if (auth?.access_token) {
            ws.current = new WebSocket(`${import.meta.env.VITE_BACKEND_URL_WS}/ws/chatbot/?token=${auth.access_token}`)

            ws.current.onopen = () => {
                console.log('Websocket connected')
                setMessages((prev) => [...prev]);
            };

            ws.current.onmessage = (event) => {
                const response = event.data;
                console.log(`Response: ${response}`)
                setMessages((prev) => [
                    ...prev,
                    { message: response, isServerResponse: true } // Marcar como respuesta del servidor
                ]);
            };

            ws.current.onclose = () => {
                console.log('websocket closed')
                setMessages((prev) => [...prev,]);
            };

            return () => {
                if (ws.current) ws.current.close();
            };
        }

    }, [auth?.access_token])


    const handlerSubmit = async e => {
        e.preventDefault();
        if (!message.trim()) {
            toast({
                variant: "destructive",
                title: "Message cannot be empty",
                description: "Please enter a message before sending",
                duration: 3000
            })
            return
        }

        const data = {
            message,
            target_language: auth?.preferences?.target_language || 'en',
            isServerResponse: false
        }

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
            setMessages((prev) => [...prev, data]); // Añadir el mensaje enviado al historial
            // setMessage("");
        } else {
            console.log("WebSocket is not open");
        }

    }

    const MessageContainer = ({ messages }) => {
        return (
            <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isServerResponse ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`
                                max-w-[70%] p-3 rounded-lg
                                ${msg.isServerResponse 
                                    ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                                    : 'bg-indigo-500 text-white rounded-tr-none ml-auto'
                                }
                            `}
                        >
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    
        

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
                <MessageContainer messages={messages} />
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
