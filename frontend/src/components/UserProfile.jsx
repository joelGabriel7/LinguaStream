import { useState, useEffect } from "react";
import client from "../config/axios";
import useAuth from "../hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const LoadingSpinner = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <div className="text-gray-700 font-monserrat text-sm">Loading your preferences...</div>
        </div>
    </div>
);

const UserProfileModal = ({ handleClose }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('');
    const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { auth, setAuth } = useAuth();
    const { toast } = useToast(); // Usamos el hook para las notificaciones

    const getConfig = () => ({
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('access_token_LSAI')}`
        }
    });

    const loadUserData = async () => {
        try {
            const response = await client.get('/user/me', getConfig());
            setAuth(prevAuth => ({
                ...prevAuth,
                ...response.data
            }));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load user data. Please try again.",
                duration: 3000
            });
        }
    };

    const loadLanguages = async () => {
        try {
            const response = await client.get('/languages/all', getConfig());
            setLanguages(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load languages. Please try again.",
                duration: 3000
            });
        }
    };

    const loadPreferences = async () => {
        const storedPreferences = localStorage.getItem('user_preferences');
        
        if (storedPreferences) {
            const preferences = JSON.parse(storedPreferences);
            setSelectedSourceLanguage(preferences.source_language);
            setSelectedTargetLanguage(preferences.target_language);
            return;
        }
    
        try {
            const response = await client.get('/user/preferences', getConfig());
            if (response.data) {
                setSelectedSourceLanguage(response.data.source_language);
                setSelectedTargetLanguage(response.data.target_language);
                localStorage.setItem('user_preferences', JSON.stringify({
                    source_language: response.data.source_language,
                    target_language: response.data.target_language
                }));
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load user preferences. Please try again.",
                duration: 3000
            });
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            try {
                await loadUserData();
                await loadLanguages();
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSourceLanguage || !selectedTargetLanguage) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select both source and target languages.",
                duration: 3000
            });
            return;
        }

        if (selectedSourceLanguage === selectedTargetLanguage) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Source and target languages must be different.",
                duration: 3000
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await client.post('/user/preferences', {
                source_languages: selectedSourceLanguage,
                target_languages: selectedTargetLanguage
            }, getConfig());

            const preferences = {
                source_language: selectedSourceLanguage,
                target_language: selectedTargetLanguage
            }
            setAuth(prev => ({
                ...prev,
                preferences
            }));

            localStorage.setItem('user_preferences', JSON.stringify(preferences));
            toast({
                variant: "default",
                title: "Success",
                description: response.data.message || 'Preferences updated successfully.',
                duration: 3000
            });
            handleClose();
       

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update preferences. Please try again.",
                duration: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPreferences(); 
    }, []);
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            {alert?.text && <Tostify message={alert} />}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 font-monserrat">
                            User Profile
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium font-monserrat text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                value={auth?.name || ''}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium font-monserrat text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                value={auth?.email || ''}
                                readOnly
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mt-6 space-y-4">
                            <h5 className="text-gray-800 font-semibold font-monserrat">
                                Language Preferences
                            </h5>

                            <div>
                                <label className="block text-sm font-medium font-monserrat text-gray-700">
                                    Source Language
                                </label>
                                <select
                                    value={selectedSourceLanguage}
                                    onChange={(e) => setSelectedSourceLanguage(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700"
                                >
                                    <option value="">Select a language</option>
                                    {languages.map((lang) => (
                                        <option key={lang.id} value={lang.language_code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium font-monserrat text-gray-700">
                                    Target Language
                                </label>
                                <select
                                    value={selectedTargetLanguage}
                                    onChange={(e) => setSelectedTargetLanguage(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700"
                                >
                                    <option value="">Select a language</option>
                                    {languages.map((lang) => (
                                        
                                        <option key={lang.id} value={lang.language_code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-monserrat"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-monserrat"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UserProfileModal;
