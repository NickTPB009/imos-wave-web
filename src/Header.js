import React from "react";
import logo from './assets/logo.png';

const Header = () => {
    return (
        <header className="bg-white text-sky-800 py-4 height:20%">
        <nav className="container mx-auto flex justify-between items-center px-4">
            
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-20 w-30 mr-3" />
                <div className="text-2xl font-bold">IMOS - Wave Data</div>
            </div>
            
            <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-gray-200">Home</a></li>
                <li><a href="#" className="hover:text-gray-200">About</a></li>
                <li><a href="#" className="hover:text-gray-200">Service</a></li>
                <li><a href="#" className="hover:text-gray-200">Contact</a></li>
            </ul>
        </nav>
    </header>
    );
};

export default Header;