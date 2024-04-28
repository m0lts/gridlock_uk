// Utils
import { filterDriverResponse } from '../../utils/FilterApiResponses';
import { getTeamColour } from '../../utils/getTeamColour'
import { RocketIcon, StopwatchIcon } from '../Icons/Icons';
// Styles
import './driver-grid.styles.css'

export const DriverListLarge = ({ drivers }) => {
    return (
        <section className="driver-grid large">
            {drivers.map((driver, index) => {
                return (
                    <div key={index} className="driver">
                        <h3 className='driver-position'>P{index + 1}</h3>
                        <div className='driver-details' style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(driver.driverTeam)}` }}>
                            <h6>{driver.driverNumber}</h6>
                            <div className="driver-image">
                                <img src={driver.driverImage} />
                            </div>
                            <div className="driver-name">
                                <p>{driver.driverFirstName}</p>
                                <h3>{driver.driverLastName}</h3>
                            </div>
                        </div>
                    </div>
                )
            })}
        </section>
    )

}

export const DriverListSmall = ({ prediction, result, boost }) => {

    const resultData = filterDriverResponse(result);

    const isGridBoost = prediction.length === 20;

    const pointsArray = prediction.map((predictedDriver, index) => {
        const actualDriver = resultData.find(driver => driver.driverAbbr === predictedDriver.driverAbbr);
        if (actualDriver) {
            if (isGridBoost) {
                // 'Grid' boost scoring: +3 points for correct position, no points for just including
                return index === resultData.indexOf(actualDriver) ? 3 : 0;
            } else {
                // Normal scoring: +1 point for including, +2 additional points for correct position
                return index === resultData.indexOf(actualDriver) ? 3 : 1;
            }
        } else {
            return 0;
        }
    });

    return (
        <section className="driver-grid small">
            {boost && (
                <h3 className="used-boost">
                    {boost === 'Quali' ? (
                        <StopwatchIcon />
                    ) : (
                        <RocketIcon />
                    )}
                    {boost} Boost
                </h3>
            )}
            <div className="prediction-column">
                <h3 className='column-title'>Prediction</h3>
                {prediction.map((driver, index) => {
                    return (
                        <div key={index} className="driver">
                            <h3 className='driver-position'>P{index + 1}</h3>
                            <div className='driver-details' style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(driver.driverTeam)}` }}>
                                <div className="driver-image">
                                    <img src={driver.driverImage} />
                                </div>
                                <div className="driver-name">
                                    <h3>{driver.driverAbbr}</h3>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="result-column">
                <h3 className='column-title'>Result</h3>
                {resultData.map((driver, index) => {
                    return (
                        <div key={index} className="driver">
                            <div className='driver-details' style={{ border: `1px solid ${getTeamColour(driver.driverTeam)}`, borderLeft: `5px solid ${getTeamColour(driver.driverTeam)}` }}>
                                <div className="driver-image">
                                    <img src={driver.driverImage} />
                                </div>
                                <div className="driver-name">
                                    <h3>{driver.driverAbbr}</h3>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="points-column">
                <h3 className='column-title'>Points</h3>
                {pointsArray.map((points, index) => (
                    <div key={index} className="points">
                        <h3 className='position'>+{points}</h3>
                    </div>
                ))}
            </div>
        </section>
    )
}