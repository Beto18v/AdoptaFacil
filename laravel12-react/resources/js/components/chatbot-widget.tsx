import React, { useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const ChatbotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '¡Hola! Soy tu asistente de adopciones. ¿En qué puedo ayudarte hoy? 🐶', sender: 'bot' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const newMessage: Message = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue('');

        // Simular respuesta del bot
        setTimeout(() => {
            const botResponse: Message = {
                id: messages.length + 2,
                text: 'Gracias por tu mensaje. Estoy aquí para ayudarte con todo lo relacionado a adopciones. ¿Tienes alguna pregunta específica? 🐱',
                sender: 'bot',
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-4 bottom-6 z-50 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50"
                aria-label="Abrir chat"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            </button>

            {/* Modal de chat */}
            {isOpen && (
                <div className="fixed right-4 bottom-22 z-50 flex h-96 w-80 flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 animate-in fade-in-0 zoom-in-95 dark:border-gray-700 dark:bg-gray-800">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                <span className="text-sm">🐾</span>
                            </div>
                            <h3 className="text-lg font-semibold">Asistente de Adopciones</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white transition-colors hover:text-gray-200"
                            aria-label="Cerrar chat"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Área de mensajes */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'bot' && (
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                                        <span className="text-xs text-white">🐾</span>
                                    </div>
                                )}
                                <div
                                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm ${
                                        message.sender === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                            : 'border border-gray-200 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                                    }`}
                                >
                                    {message.text}
                                </div>
                                {message.sender === 'user' && (
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                                        <span className="text-xs">👤</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input y botón */}
                    <div className="flex rounded-b-2xl border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 rounded-l-xl border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="rounded-r-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
