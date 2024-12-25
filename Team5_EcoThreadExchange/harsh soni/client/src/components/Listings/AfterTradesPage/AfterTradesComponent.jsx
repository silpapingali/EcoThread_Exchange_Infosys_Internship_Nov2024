import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AfterTradesComponent = () => {
    const [proposals, setProposals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/proposals'); // Adjust the endpoint as needed
                setProposals(response.data);
            } catch (error) {
                console.error("Error fetching proposals:", error);
                setError("Failed to load proposals.");
            }
        };

        fetchProposals();
    }, []);

    return (
        <div>
            <h1>Trade Proposals</h1>
            {error && <div>{error}</div>}
            {proposals.length > 0 ? (
                proposals.map((proposal) => (
                    <div key={proposal._id}>
                        <p>Item ID: {proposal.itemId}</p>
                        <p>Proposed By: {proposal.proposedBy}</p>
                        <p>Proposed To: {proposal.proposedTo}</p>
                        <p>Created At: {new Date(proposal.createdAt).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No proposals yet.</p>
            )}
        </div>
    );
};

export default AfterTradesComponent; 