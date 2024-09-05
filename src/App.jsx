import React, { useState } from 'react'; // useState hook importeres for at håndtere komponentens tilstand.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importerer Router, Routes og Route fra react-router-dom for at håndtere routing i applikationen.
import './App.scss'; // Importerer globale SCSS-styles.
import Home from './Pages/Home';
import SortingGuide from './Pages/SorteringsGuide';
import SorteringsGuideDetails from './Pages/SorteringsGuideDetails'; 
import StationDetails from './Pages/StationsDetails';
import RecyclingStations from './Pages/RecyclingStations';
import OrderContainer from './Pages/OrderContainer';
import Login from './Pages/Login';
import Article from './Pages/Article';
import PageLayout from './components/PageLayout'; // Importerer en layout-komponent, som indkapsler siden.
import ThankYou from './Pages/ThankYou';

const App = () => {
    // useState hook bruges her til at håndtere brugerens loginstatus. 
    // useState returnerer et array med to elementer: den nuværende state (`user`) og en funktion til at opdatere state (`setUser`).
    const [user, setUser] = useState(null);

    return (
        // Router-komponenten fra react-router-dom indkapsler hele appen, hvilket gør det muligt at håndtere navigation mellem sider uden at genindlæse siden.
        <Router>
            {/* PageLayout er en komponent, der omkranser hovedindholdet og modtager `user` og `setUser` som props.
                Props bruges her til at sende information om brugerens tilstand til layoutet og child-komponenter. */}
            <PageLayout user={user} setUser={setUser}>
                <main>
                    {/* Routes definerer, hvilke komponenter der skal rendere for forskellige URL-paths. */}
                    <Routes>
                        {/* Route-komponenterne bruges til at matche URL'er med de tilsvarende komponenter.
                            For eksempel rendrer path="/" Home-komponenten. */}
                        <Route path="/" element={<Home />} />
                        <Route path="/sorting-guide" element={<SortingGuide />} />
                        
                        {/* Denne Route har en dynamisk parameter `sectionId`, som matcher en hvilken som helst værdi i URL'en. 
                            Dynamiske URL-segmenter bruges til at vise detaljerede data, f.eks. specifik information om en sorteringsguide-sektion. */}
                        <Route path="/sorting-guide/:sectionId" element={<SorteringsGuideDetails />} />

                        <Route path="/recycling-stations" element={<RecyclingStations />} />
                        
                        {/* `user`-tilstanden sendes som prop til StationDetails-komponenten, hvilket gør det muligt for den at bruge information om den aktuelle bruger. */}
                        <Route path="/recycling-stations/:id" element={<StationDetails user={user} />} />
                        
                        <Route path="/order-container" element={<OrderContainer />} />
                        <Route path="/thank-you" element={<ThankYou />} />
                        
                        {/* `setUser`-funktionen sendes som prop til Login-komponenten, så Login-komponenten kan opdatere brugerens tilstand, når login-processen gennemføres. */}
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        
                        {/* `:id` i path betyder, at denne Route håndterer dynamiske artikel-id'er, som kan bruges til at vise forskellige artikler baseret på URL'ens id. */}
                        <Route path="/articles/:id" element={<Article />} />
                    </Routes>
                </main>
            </PageLayout>
        </Router>
    );
};

export default App;
