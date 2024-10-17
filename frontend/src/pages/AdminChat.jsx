const AdminChat = () => {
    return (
        <div className="flex flex-col h-screen justify-center items-center p-4">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 text-center font-bold rounded-lg shadow-lg w-full  max-w-5xl">
                <h1>LingueStreamAI</h1>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-auto p-4 border border-indigo-300 rounded-lg shadow-lg bg-white w-full max-w-5xl mt-4">

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
                <div className="flex">
                    <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Type your message..."
                    />
                    <button className="bg-indigo-600 text-white rounded-lg px-4 hover:bg-indigo-700">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;
