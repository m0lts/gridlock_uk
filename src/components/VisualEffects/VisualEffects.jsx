import BackgroundImg from '../../assets/images/background.png';
import './visual-effects.styles.css';

export const Background = () => {
    return (
        <div className="background">
            <img src={BackgroundImg} alt="" />
        </div>
    )
}

export const Arrows = () => {
    return (
        <section className="arrows">
            <div className="upper">
            </div>
            <div className="lower">
            </div>
        </section>
    )
}

export const Crosses = () => {
    return (
        <section className="crosses">
            
        </section>
    )
}