import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FindBooks from './pages/FindBooks';
import Library from './pages/Library';
import Wishlist from './pages/Wishlist';
import BookDetails from './pages/BookDetails';
import Following from './pages/Following';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="find" element={<FindBooks />} />
        <Route path="library" element={<Library />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="following" element={<Following />} />
        <Route path="book/:id" element={<BookDetails />} />
        <Route path="admin" element={<Admin />} />
        {/* Fallback for 404 could go here */}
        <Route path="*" element={<div className="p-4">Page not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
