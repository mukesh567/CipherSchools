import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ChevronRight, Filter } from 'lucide-react';

const HomePage = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.get('/assignments');
                setAssignments(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching assignments:', err);
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    return (
        <div className="home-page container">
            <header className="home-page__header">
                <h1>SQL Learning <span>Assignments</span></h1>
                <p>Practice your SQL skills with real-world scenarios and intelligent guidance.</p>
            </header>

            <div className="home-page__filters">
                <div className="filter-pill active">All</div>
                <div className="filter-pill">Easy</div>
                <div className="filter-pill">Medium</div>
                <div className="filter-pill">Hard</div>
            </div>

            <div className="home-page__grid">
                {loading ? (
                    <div className="loader">Loading assignments...</div>
                ) : (
                    assignments.map((assignment) => (
                        <div key={assignment._id} className="assignment-card">
                            <div className={`assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
                                {assignment.difficulty}
                            </div>
                            <h3 className="assignment-card__title">{assignment.title}</h3>
                            <p className="assignment-card__desc">{assignment.description}</p>
                            <Link to={`/assignment/${assignment._id}`} className="assignment-card__btn">
                                Attempt Now <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;
