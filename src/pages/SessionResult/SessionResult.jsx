import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"
import { LoaderWhite } from "../../components/Loader/Loader";
import { filterDriverResponse } from "../../utils/FilterApiResponses";
import { DriverListLarge } from "../../components/DriverGrid/DriverGrid";
import './session-result.styles.css';
import { getCountryFlag } from "../../utils/getCountryFlag";


export const SessionResult = ({ sessionData }) => {

    const [resultData, setResultData] = useState(null);

    const location = useLocation();
    const inheritedState = location.state;

    const params = useParams();
    const sessionId = params.sessionId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/externalData/CallApi.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(`/rankings/races?race=${sessionId}`),    
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setResultData(filterDriverResponse(responseData.result.response));
                } else {
                    console.log('Failure:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [sessionId]);

    return (
        <section className="session-result">
            <div className="heading">
                <div className="left">
                    <h3>{inheritedState.competition.name}</h3>
                    <h2>{inheritedState.type} Results</h2>
                </div>
                <div className="right">
                    <figure className="circular-flag x-large">
                        <img src={getCountryFlag(inheritedState.competition.location.country)} alt={`${inheritedState.competition.location.country} flag`} />
                    </figure>
                </div>
            </div>
            {resultData ? (
                <div className="results">
                    <DriverListLarge 
                        drivers={resultData}
                    />
                </div>
            ) : (
                <div className="results">
                    <LoaderWhite />
                </div>
            )}
        </section>
    )
}