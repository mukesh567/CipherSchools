import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AssignmentPage from './pages/AssignmentPage';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/assignment/:id" element={<AssignmentPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
