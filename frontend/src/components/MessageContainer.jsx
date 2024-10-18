import { useEffect, useRef, useState } from 'react'

const MessageContainer = ({ messages }) => {
    const messagesEndRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(true);

    // Función para desplazar el scroll al final
    const scrollToBottom = () => {
        if (shouldScroll) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Desplazar el scroll solo cuando se reciben nuevos mensajes
    useEffect(() => {
        scrollToBottom();
        setShouldScroll(true);
    }, [messages]);

    return (
        <div className="flex flex-col gap-6 py-4 px-4 md:px-8 overflow-y-auto max-h-[500px]">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.isServerResponse ? 'justify-start' : 'justify-end'} items-start gap-3`}
                >
                    {msg.isServerResponse ? (
                        <>
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0">
                                {/* Avatar del chatbot como SVG */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    className="w-8 h-8"
                                >
                                    <circle cx="12" cy="12" r="10" className="fill-current text-indigo-600" />
                                    <path d="M9 12h6M9 16h6" stroke="white" strokeWidth={2} strokeLinecap="round" />
                                </svg>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0">
                                <div className="bg-blue-500 rounded-full w-full h-full flex items-center justify-center text-white">
                                    U
                                </div>
                            </div>
                        </>
                    )}
                    <div
                        className={`max-w-[70%] p-4 rounded-2xl
                            ${msg.isServerResponse
                                ? 'bg-gray-100/80 text-gray-800 rounded-tl-none'
                                : 'bg-indigo-600 text-white rounded-tr-none'
                            }`}
                    >
                        <p className="text-[15px] leading-relaxed">{msg.message}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageContainer;