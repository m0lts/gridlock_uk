import './how-to-play.styles.css'
import { PrimaryHeading } from '../../components/Typography/Titles/Titles'

export const HowToPlay = ({ backgroundColour, textColour, accentColour }) => {
    return (
        <section className={`how-to-play bckgrd-${backgroundColour}`}>
            <PrimaryHeading
                title="How to play"
                accentColour={accentColour}
                backgroundColour={backgroundColour === "black" ? "white" : "black"}
                textColour={textColour === "white" ? "black" : "white"}
            />
            <div className={`info ${textColour}`}>
                <div className="sec1">
                    <h3>Overview:</h3>
                    <p>Gridlock is a F1 prediction app. Each weekend users predict which drivers they think will finish in what position.</p>
                    <h3>Prizes:</h3>
                    <p>The following prizes are for the final rankings in the global Gridlock standings.</p>
                    <div className="prizes">
                        <p className='prize'>2nd place: <span>£50</span></p>
                        <p className='prize'>1st place: <span>£100</span></p>
                        <p className='prize'>3rd place: <span>£25</span></p>
                    </div>
                </div>
                <div className="sec2">
                    <h3>How to play:</h3>
                    <p>Each weekend users predict which top 10 drivers they think will finish in what position. For each correct prediction, the user will be awarded points. The user with the most points at the end of the season will be crowned the winner.</p>
                </div>
                <div className="sec3">
                    <h3>Format:</h3>
                    <div className='grid'>
                        <h1>01</h1>
                        <p>Fill in your prediction for the top 10 drivers for each round.</p>
                    </div>
                    <div className='grid'>
                        <h1>02</h1>
                        <p>Submit your prediction before qualifying starts. If you fail to submit a prediction, a randomised prediction will be automatically submitted for you.</p>
                    </div>
                </div>
                <div className="sec4">
                    <h3>Points:</h3>
                    <div className="grid">
                        <h1>1 <span>point</span></h1>
                        <p>For predicting a driver to finish in the top 10.</p>
                    </div>
                    <div className="grid">
                        <h1>3 <span>points</span></h1>
                        <p>For predicting each driver in the correct position.</p>
                    </div>
                    <div className="grid">
                        <h1>10 <span>bonus points</span></h1>
                        <p>For getting all 10 drivers in the correct position.</p>
                    </div>
                    <p>The maximum available points per weekend is 40 points.</p>
                </div>
            </div>
        </section>

    )
}