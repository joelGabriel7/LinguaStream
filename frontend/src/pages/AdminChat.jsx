import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";

const AdminChat = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [preferencesSet, setPreferencesSet] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { auth } = useAuth();
    const { toast } = useToast();
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);

    // Efecto para manejar la inicialización y carga de mensajes
    useEffect(() => {
        const initializeChat = async () => {
            if (auth?.access_token && !isInitialized) {
                const storedMessages = localStorage.getItem(`chat_history_${auth.access_token}`);
                if (storedMessages) {
                    try {
                        const parsedMessages = JSON.parse(storedMessages);
                        setMessages(parsedMessages);
                        console.log('Mensajes cargados:', parsedMessages);
                    } catch (error) {
                        console.error('Error parsing stored messages:', error);
                        setMessages([]);
                    }
                }
                setIsInitialized(true);
            }
        };

        initializeChat();
    }, [auth?.access_token, isInitialized]);

    // Reiniciar el estado cuando el token no está presente
    useEffect(() => {
        if (!auth?.access_token) {
            setMessages([]);
            setIsInitialized(false);
            if (ws.current) {
                ws.current.close();
            }
        }
    }, [auth?.access_token]);

    // Guardar mensajes cuando cambien
    useEffect(() => {
        if (auth?.access_token && messages.length > 0) {
            localStorage.setItem(`chat_history_${auth.access_token}`, JSON.stringify(messages));
            console.log('Mensajes guardados:', messages);
        }
    }, [messages, auth?.access_token]);

    useEffect(() => {
        if (auth?.preferences?.source_language && auth?.preferences?.target_language) {
            setPreferencesSet(true);
        } else {
            setPreferencesSet(false);
        }
    }, [auth]);

    // Conectar WebSocket cuando el token esté disponible
    useEffect(() => {
        if (auth?.access_token && isInitialized) {
            connectWebsocket();

            return () => {
                if (ws.current) {
                    ws.current.close();
                    if (reconnectTimeout.current) {
                        clearTimeout(reconnectTimeout.current);
                    }
                }
            };
        }
    }, [auth?.access_token, isInitialized]);

    const connectWebsocket = () => {
        if (!auth?.access_token) return;

        ws.current = new WebSocket(`${import.meta.env.VITE_BACKEND_URL_WS}/ws/chatbot/?token=${auth.access_token}`);

        ws.current.onopen = () => {
            console.log('Websocket connected');
            setIsConnected(true);
        };

        ws.current.onmessage = (event) => {
            const response = event.data;
            setMessages(prev => [...prev, { message: response, isServerResponse: true }]);
        };

        ws.current.onclose = () => {
            setIsConnected(false);
        };

        ws.current.onerror = (error) => {
            setIsConnected(false);
            handleReconnect();
        };
    };

    const handleReconnect = () => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }

        reconnectTimeout.current = setTimeout(() => {
            if (!isConnected && auth?.access_token) {
                toast({
                    variant: 'destructive',
                    title: 'Connection error',
                    description: 'There was an issue connecting to the chat.',
                    duration: 3000,
                });
                connectWebsocket();
            }
        }, 5000);
    };

    const handlerSubmit = e => {
        e.preventDefault();

        if (!message.trim()) {
            toast({
                variant: "destructive",
                title: "Message cannot be empty",
                description: "Please enter a message before sending",
                duration: 3000
            });
            return;
        }

        const data = {
            message,
            target_language: auth?.preferences?.target_language || 'en',
            isServerResponse: false
        };

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
            setMessages(prev => [...prev, data]);
            setMessage("");
        }
    };

    const MessageContainer = ({ messages }) => {
        const messagesEndRef = useRef(null);

        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        useEffect(() => {
            scrollToBottom();
        }, [messages]);

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
                <div ref={messagesEndRef} />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            <div className="bg-white text-indigo-500 text-2xl py-3 px-4 text-center font-medium shadow-sm flex-shrink-0">
                <h1>LingueStreamAI</h1>
            </div>

            <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto overflow-hidden">
                <div className="flex-1 flex items-end justify-end overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <MessageContainer messages={messages} />
                </div>

                <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
                    <form onSubmit={handlerSubmit} className="max-w-4xl mx-auto">
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                className="flex-1 rounded-2xl border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[15px]"
                                placeholder="Type here..."
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