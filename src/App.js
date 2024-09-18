// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
};

export default App;
