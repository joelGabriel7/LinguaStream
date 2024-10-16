import { useState, useEffect } from "react";
import client from "../config/axios";
import useAuth from "../hooks/useAuth";
import Tostify from '../components/Tostify'

const UserProfileModal = ({ handleClose }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('');
    const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('');
    const [alert, setAlert] = useState({});  // Cambiado a null inicialmente
    const { auth, setAuth } = useAuth();
    const { name, email, } = auth;

    const token = localStorage.getItem('access_token_LSAI');
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [languagesResponse, preferencesResponse, userResponse] = await Promise.all([
                    client.get('/languages/all', config),
                    client.get('/user/preferences', config),
                    client('/user/me', config)
                ]);

                setAuth(prevAuth => ({
                    ...prevAuth,
                    ...userResponse.data
                }))

                setLanguages(languagesResponse.data);
                if (preferencesResponse.data) {
                    setSelectedSourceLanguage(preferencesResponse.data.source_language);
                    setSelectedTargetLanguage(preferencesResponse.data.target_language);
                } else {
                    setSelectedSourceLanguage(languagesResponse.data[0]?.code || '');
                    setSelectedTargetLanguage(languagesResponse.data[1]?.code || '');
                }
            } catch (error) {
                setAlert({
                    text: 'Error al cargar las preferencias',
                    error: true
                });
            }
        };

        fetchInitialData();
    }, [setAuth]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([selectedSourceLanguage, selectedTargetLanguage].includes('')) {
            setAlert({
                text: 'Configura las preferencias de idiomas por favor',
                error: true
            });
            return;
        }

        const data = {
            source_languages: selectedSourceLanguage,
            target_languages: selectedTargetLanguage
        };

        try {
            const response = await client.post('/user/preferences', data, config);

            // Actualizar el estado global del usuario
            setAuth(prev => ({
                ...prev,
                preferences: {
                    source_language: selectedSourceLanguage,
                    target_language: selectedTargetLanguage
                }
            }));

            // Mostrar mensaje de éxito
            setAlert({
                text: response.data.message,
                error: false
            });

            // Cerrar modal después de un delay
            setTimeout(() => {
                handleClose();
            }, 4000);

        } catch (error) {
            console.log(error)
            setAlert({
                text: 'Error al actualizar las preferencias',
                error: true
            });
        }
    };

    return (
        <>
            {alert && <Tostify message={alert} />}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 font-monserrat">Profile</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-600 hover:text-red-500"
                        >
                            &times;
                        </button>
                    </div>

                    {/* User Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium font-monserrat text-gray-700">Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                value={name || ''}
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium font-monserrat text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full px-3 py-2  font-monserrat bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                value={email || ''}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Language Preferences */}
                    <form onSubmit={handleSubmit}>
                        <div className="mt-6 space-y-4">
                            <h5 className="text-gray-800 font-semibold font-monserrat">Language Preferences</h5>

                            <div>
                                <label className="block text-sm font-medium font-monserrat text-gray-700">Source Language</label>
                                <select
                                    value={selectedSourceLanguage}
                                    onChange={e => setSelectedSourceLanguage(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                >
                                    <option value="" className="font-monserrat">Select a language</option>
                                    {languages.map(lang => (
                                        <option key={lang.id} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-monserrat">Target Language</label>
                                <select
                                    value={selectedTargetLanguage}
                                    onChange={e => setSelectedTargetLanguage(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                                >
                                    <option value="" className="font-monserrat">Select a language</option>
                                    {languages.map(lang => (
                                        <option key={lang.id} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 font-monserrat text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600  font-monserrat text-white rounded-md hover:bg-blue-700"
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
