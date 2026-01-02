import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Library, Search, BookOpen, BookHeart, Settings, Users } from 'lucide-react';

const Layout = () => {
    const navItems = [
        { to: '/', label: 'Home', icon: BookOpen },
        { to: '/find', label: 'Find Books', icon: Search },
        { to: '/library', label: 'Library', icon: Library },
        { to: '/wishlist', label: 'Wishlist', icon: BookHeart },
        { to: '/following', label: 'Following', icon: Users },
        { to: '/admin', label: 'Admin', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">

                                <div className="flex items-center gap-2">
                                    <img src="/header_mascot.png" alt="Wile E. Coyote" className="h-12 w-auto -mb-2" />
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Bookshelf
                                    </span>
                                </div>

                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${isActive
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        {/* Mobile menu button could go here */}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
