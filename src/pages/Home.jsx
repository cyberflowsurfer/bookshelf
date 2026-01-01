import React from 'react';
import { CheckCircle, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Bookshelf</h1>
                        <p className="text-gray-600 mb-6">
                            Track your reading journey, discover new books, and manage your wishlist.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <img src="/wile-cyote-genius.png" alt="Wile E. Coyote Genius" className="max-h-64 object-contain" />
                    </div>
                </div>
            </div>

            {/* Placeholder for future functionality: Recently Read, Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6 h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                    <CheckCircle className="h-12 w-12 mb-2 opacity-20" />
                    <span>Recently Read Widget (Coming Soon)</span>
                </div>
                <div className="bg-white shadow rounded-lg p-6 h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                    <BookOpen className="h-12 w-12 mb-2 opacity-20" />
                    <span>Recommendations Widget (Coming Soon)</span>
                </div>
            </div>
        </div>
    );
};

export default Home;
