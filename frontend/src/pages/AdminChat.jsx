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
    const [isTyping, setIsTyping] = useState(false);
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
            setMessages((prev) => [...prev, data]); 
            setMessage("");
        } else {
            console.log("WebSocket is not open");
        }

    }

    const TypingIndicator = () => {
        return (
            <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[70%]">
                    <div className="flex gap-1 items-center">
                        <span className="text-red-600">Escribiendo</span>
                        <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-blu-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                        </span>
                    </div>
                </div>
            </div>
        );
    };


    const MessageContainer = ({ messages, isTyping }) => {
        const messagesEndRef = useRef(null);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        useEffect(() => {
            scrollToBottom();
        }, [messages, isTyping]);

        return (
            <div className="flex flex-col gap-6 py-4 px-4 md:px-8">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isServerResponse ? 'justify-start' : 'justify-end'} items-start gap-3`}
                    >
                        {msg.isServerResponse && (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0" />
                        )}
                        <div
                            className={`
                                max-w-[70%] p-4 rounded-2xl
                                ${msg.isServerResponse
                                    ? 'bg-gray-100/80 text-gray-800 rounded-tl-none'
                                    : 'bg-indigo-600 text-white rounded-tr-none'
                                }
                            `}
                        >
                            <p className="text-[15px] leading-relaxed">{msg.message}</p>
                        </div>
                        {!msg.isServerResponse && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0" />
                        )}
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        );
    };




        return (
            <div className="flex flex-col h-screen bg-white overflow-hidden">
              {/* Header */}
              <div className="bg-white text-indigo-500 text-2xl py-3 px-4 text-center font-medium shadow-sm flex-shrink-0">
                <h1>LingueStreamAI</h1>
              </div>
          
              {/* Main container */}
              <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto overflow-hidden">
                {/* Alert area */}
                {showAlert && !preferencesSet && (
                  <div className="px-4 pt-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Aviso!</AlertTitle>
                      <AlertDescription>{alert?.text}</AlertDescription>
                    </Alert>
                  </div>
                )}
          
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <MessageContainer messages={messages} isTyping={isTyping} />
                </div>
          
                {/* Input area */}
                <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
                    <form onSubmit={handlerSubmit} className="max-w-4xl mx-auto">
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                className="flex-1 rounded-2xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[15px]"
                                placeholder="Escribe un mensaje..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />
                            <button 
                                disabled={!preferencesSet} 
                                className="bg-indigo-600 text-white rounded-full p-3 h-12 w-12 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 rotate-90">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
              </div>
          
            </div>
          );
          
};

export default AdminChat;
