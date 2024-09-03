// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header';
import Home from './Pages/Home';
import SortingGuide from './Pages/SorteringsGuide';
import SorteringsGuideDetails from './Pages/SorteringsGuideDetails'; // Importer den nye komponent
import Footer from './components/Footer';
import StationDetails from './Pages/StationsDetails';
import RecyclingStations from './Pages/RecyclingStations';
import OrderContainer from './Pages/OrderContainer';
import Login from './Pages/Login';
import Article from './Pages/Article';
import PageLayout from './components/PageLayout';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <PageLayout user={user} setUser={setUser}>
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sorting-guide" element={<SortingGuide />} />
                        <Route path="/sorting-guide/:sectionId" element={<SorteringsGuideDetails />} />
                        <Route path="/recycling-stations" element={<RecyclingStations />} />
                        <Route path="/recycling-stations/:id" element={<StationDetails user={user} />} />
                        <Route path="/order-container" element={<OrderContainer />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/articles/:id" element={<Article />} />
                    </Routes>
                </main>
         
            </PageLayout>
        </Router>
    );
};

export default App;
