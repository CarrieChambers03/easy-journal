import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import RefreshToken from './components/refreshToken.jsx';
import AuthProvider from './context/authContext.jsx';
import AdminRoute from './context/adminRoute.jsx';

import Register from './pages/register/register.jsx';
import Login from './pages/login/login.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Search from './pages/search/search.jsx';
import CreateEntry from './pages/journalEntry/createEntry.jsx';
import ViewEntry from './pages/journalEntry/viewEntry.jsx';
import EditEntry from './pages/journalEntry/editEntry.jsx';

function App() {
  return (
      <Router>
        <RefreshToken />
        <AuthProvider>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element = {<Login />} />

            <Route path='/' element={<Navigate to="/dashboard" />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/search' element={<Search />} />
            <Route path='/journalEntry/new' element={<CreateEntry />} />
            <Route path='/journalEntry/:entryID' element={<ViewEntry />} />
            <Route path='/journalEntry/edit/:entryID' element={<EditEntry />} />

        </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
