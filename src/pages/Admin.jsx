import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportData, importData } from '../services/storage';
import { useNotification } from '../context/NotificationContext';

const Admin = () => {
    const fileInputRef = useRef(null);
    const { showNotification } = useNotification();

    const handleExport = () => {
        try {
            exportData();
            showNotification('Data exported successfully!', 'success');
        } catch (e) {
            showNotification('Failed to export data: ' + e.message, 'error');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!window.confirm("Importing data will overwrite your current library and wishlist. Continue?")) {
            e.target.value = ''; // Reset input
            return;
        }

        try {
            await importData(file);
            showNotification('Data imported successfully! Reloading...', 'success');
            setTimeout(() => window.location.reload(), 1500); // Delay reload to show message
        } catch (e) {
            showNotification('Failed to import data: ' + e.message, 'error');
        } finally {
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin settings</h1>
                <p className="text-gray-600 mb-6">
                    Manage your application data.
                </p>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Export Data
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Upload className="h-5 w-5 mr-2" />
                            Import Data
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImport}
                            className="hidden"
                            accept=".json"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
