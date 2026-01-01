import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'success', duration = 3000) => {
        setNotification({ message, type });
        if (duration > 0) {
            setTimeout(() => {
                setNotification(null);
            }, duration);
        }
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            {/* Notification Banner */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out`}>
                    <div className={`rounded-md shadow-lg p-4 flex items-center space-x-3 ${notification.type === 'success' ? 'bg-green-50 text-green-800' :
                            notification.type === 'error' ? 'bg-red-50 text-red-800' :
                                'bg-blue-50 text-blue-800'
                        }`}>
                        {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {notification.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                        {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}

                        <p className="text-sm font-medium">{notification.message}</p>

                        <button
                            onClick={hideNotification}
                            className={`ml-auto inline-flex text-gray-400 hover:text-gray-500 focus:outline-none`}
                        >
                            <span className="sr-only">Close</span>
                            <XCircle className="h-4 w-4 opacity-50" />
                        </button>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};
