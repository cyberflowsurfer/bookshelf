import React from 'react';
import ReactDOM from 'react-dom';

const HoverDescription = ({ text, position, visible }) => {
    if (!visible || !text) return null;

    // Use a portal to render outside the table overflow context
    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                top: position.y + 15, // Offset slightly from cursor
                left: position.x + 15,
                zIndex: 9999,
                maxWidth: '400px',
            }}
            className="bg-gray-900/95 text-white text-sm p-4 rounded-lg shadow-xl border border-gray-700 pointer-events-none backdrop-blur-sm animate-fade-in"
        >
            <div className="line-clamp-[15] leading-relaxed">
                {text}
            </div>
        </div>,
        document.body
    );
};

export default HoverDescription;
