import { useEffect, useState } from "react"
import { getCircuitInfo } from "../../utils/getCircuitInfo"
import { BrakingIcon, DownforceIcon, TrackEvoIcon, TyreStressIcon } from "../Icons/Icons";
import './circuit-information.styles.css'
import { Parallelograms } from "../Typography/Shapes/Shapes";

export const CircuitInformation = ({ circuitName, circuitImage }) => {

    const [circuitData, setCircuitData] = useState(circuitName ? getCircuitInfo[circuitName] : null);

    return (
        <section className="circuit-information">
            <div className="details">
                <div className="image">
                    <img src={circuitImage} alt={circuitName} />
                </div>
                <h4>{circuitName}</h4>
            </div>
            <div className="data">
                <div className="box">
                    <div className="type">
                        <DownforceIcon />
                        <p>Downforce</p>
                    </div>
                    <div className="value">
                        <Parallelograms
                            number={circuitData['downforce']}
                            color="white"
                        />
                    </div>
                </div>
                <div className="box">
                    <div className="type">
                        <TrackEvoIcon />
                        <p>Track Evo</p>
                    </div>
                    <div className="value">
                        <Parallelograms
                            number={circuitData['track evolution']}
                            color="white"
                        />
                    </div>
                </div>
                <div className="box">
                    <div className="type">
                        <BrakingIcon />
                        <p>Braking</p>
                    </div>
                    <div className="value">
                        <Parallelograms
                            number={circuitData['braking']}
                            color="white"
                        />
                    </div>
                </div>
                <div className="box">
                    <div className="type">
                        <TyreStressIcon />
                        <p>Tyre Stress</p>
                    </div>
                    <div className="value">
                        <Parallelograms
                            number={circuitData['tyre stress']}
                            color="white"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}