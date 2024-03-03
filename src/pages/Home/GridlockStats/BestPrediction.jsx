import { useEffect } from "react"
import { DriverGrid } from "../../../components/DriverGrid/DriverGrid"

export const BestPrediction = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="best-prediction section">
            <h2>Best Prediction</h2>
            <div className="details">
                <h3>m0lts</h3>
                <h3>Bahrain</h3>
                <h3>18 points</h3>
            </div>
            <DriverGrid
                numberOfDrivers={10}
            />
        </div>
    )
}