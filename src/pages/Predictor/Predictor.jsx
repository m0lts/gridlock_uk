import { PrimaryHeading, UpperCaseTitle } from '../../components/Typography/Titles/Titles'
import MonacoFlag from '../../assets/flags/monaco_flag.svg'

import './predictor.styles.css'
import { DriverGrid } from '../../components/DriverGrid/DriverGrid';
import { Parallelograms } from '../../components/Typography/Shapes/Shapes';
import { RainIcon, SunIcon, LockIcon } from '../../components/Icons/Icons';
import { PredictorGrid } from './PredictorGrid/PredictorGrid';

export const Predictor = () => {

    const userLoggedIn = true;

    const downforce = 5;
    const tyreStress = 3;
    const grip = 4;
    const trackEvolution = 5;
    const braking = 4;
    const asphaltAbrasion = 3;

    return (
        <section className="predictor">
            <div className="page-padding">
                <PrimaryHeading
                    title="Predictor"
                    accentColour="purple"
                    backgroundColour="white"
                    textColour="black"
                />
                <div className="head">
                    <div className="event">
                        <UpperCaseTitle
                            title="monaco"
                            colour="white"
                        />
                        <img src={MonacoFlag} alt="" className="flag" />
                    </div>
                    <div className="time">
                        <h3>Time Left:</h3>
                        <h3>00:47:34</h3>
                    </div>
                </div>
                {userLoggedIn ? (
                    <>
                        <div className="predictions">
                            <PredictorGrid />
                        </div>
                        <div className="two-buttons">
                            <button className="btn btn-white">Use Previous Prediction</button>
                            <button className="btn btn-purple">
                                Lock it in
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="predictor-locked">
                        <LockIcon />
                        <h3>Login to make a prediction</h3>
                    </div>
                )}
            </div>
            <div className="track-stats page-padding">
                <PrimaryHeading
                    title="Track Stats"
                    accentColour="purple"
                    backgroundColour="black"
                    textColour="white"
                />
                <div className="statistics">
                    <div className="stat">
                        <p>Downforce:</p>
                        <div className="value">
                            <Parallelograms
                                number={downforce}
                                color="black"
                            />
                        </div>
                    </div>
                    <div className="stat">
                        <p>Tyre Stress:</p>
                        <div className="value">
                            <Parallelograms
                                number={tyreStress}
                                color="black"
                            />
                        </div>
                    </div>
                    <div className="stat">
                        <p>Grip:</p>
                        <div className="value">
                            <Parallelograms
                                number={grip}
                                color="black"
                            />
                        </div>
                    </div>
                    <div className="stat">
                        <p>Track Evolution:</p>
                        <div className="value">
                            <Parallelograms
                                number={trackEvolution}
                                color="black"
                            />
                        </div>
                    </div>
                    <div className="stat">
                        <p>Braking:</p>
                        <div className="value">
                            <Parallelograms
                                number={braking}
                                color="black"
                            />
                        </div>
                    </div>
                    <div className="stat">
                        <p>Asphalt Abrasion:</p>
                        <div className="value">
                            <Parallelograms
                                number={asphaltAbrasion}
                                color="black"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="weather-forecast page-padding">
                <PrimaryHeading
                    title="Weather Forecast"
                    accentColour="purple"
                    backgroundColour="black"
                    textColour="white"
                />
                <div className="weather">
                    <div className="quali">
                        <h3>Qualifying</h3>
                        <RainIcon />
                    </div>
                    <div className="race">
                        <h3>Race</h3>
                        <SunIcon />
                    </div>
                </div>
            </div>
        </section>
    )
}