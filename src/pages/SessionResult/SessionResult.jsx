// Dependencies
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"
// Components
import { LoaderWhite } from "../../components/Loader/Loader";
import { DriverListLarge } from "../../components/DriverGrid/DriverGrid";
import { LeftChevronIcon } from "../../components/Icons/Icons";
// Utils
import { filterDriverResponse } from "../../utils/FilterApiResponses";
import { getCountryFlag } from "../../utils/getCountryFlag";
// Styles
import './session-result.styles.css';


export const SessionResult = () => {

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

        // Because the API does not return Qualifying data or Sprint Shootout data in the same way as other sessions, we need to handle these separately by getting three different sets of data and combining them.
        const fetchQualifyingData = async () => {
            try {
                const response = await fetch('/api/externalData/CallApi.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(`races?season=2024&timezone=Europe/London&competition=${inheritedState.competition.id}`),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    let thirdQualifyingResultId;
                    let secondQualifyingResultId;
                    if (inheritedState.type === 'Qualifying') {
                        thirdQualifyingResultId = responseData.result.response.filter(result => result.type === '3rd Qualifying')[0].id;
                        secondQualifyingResultId = responseData.result.response.filter(result => result.type === '2nd Qualifying')[0].id;
                    } else {
                        thirdQualifyingResultId = responseData.result.response.filter(result => result.type === '3rd Sprint Shootout')[0].id;
                        secondQualifyingResultId = responseData.result.response.filter(result => result.type === '2nd Sprint Shootout')[0].id;
                    }
                    const secondResponse = await fetch('/api/externalData/CallApi.js', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(`/rankings/races?race=${thirdQualifyingResultId}`),    
                    });
    
                    if (secondResponse.ok) {
                        const secondResponseData = await secondResponse.json();
                        const thirdQualifyingResultData = secondResponseData.result.response;
                        
                        const thirdResponse = await fetch('/api/externalData/CallApi.js', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(`/rankings/races?race=${secondQualifyingResultId}`),    
                        });
        
                        if (thirdResponse.ok) {
                            const thirdResponseData = await thirdResponse.json();
                            let secondQualifyingResultData = thirdResponseData.result.response;
                            secondQualifyingResultData = secondQualifyingResultData.slice(10);

                            const fourthResponse = await fetch('/api/externalData/CallApi.js', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(`/rankings/races?race=${sessionId}`),    
                            });

                            if (fourthResponse.ok) {
                                const fourthResponseData = await fourthResponse.json();
                                let firstQualifyingResultData = fourthResponseData.result.response;
                                firstQualifyingResultData = firstQualifyingResultData.slice(15);
                                const qualifyingResultData = thirdQualifyingResultData.concat(secondQualifyingResultData, firstQualifyingResultData);
                                setResultData(filterDriverResponse(qualifyingResultData));
                            } else {
                                console.log('Failure:', response.statusText);
                            }

                        } else {
                            console.log('Failure:', response.statusText);
                        }
                    } else {
                        console.log('Failure:', response.statusText);
                    }
                } else {
                    console.log('Failure:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        if (inheritedState.type !== 'Qualifying' && inheritedState.type !== 'Sprint Shootout') {
            fetchData();
        } else {
            fetchQualifyingData();
        }
    }, [sessionId]);

    const handleGoBack = () => {
        window.history.back();
    }

    return (
        <section className="session-result">
            <div className="back-button" onClick={handleGoBack}>
                <LeftChevronIcon />
                Back
            </div>
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