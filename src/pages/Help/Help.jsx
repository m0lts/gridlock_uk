// Components
import { Disclaimer } from '../../components/Disclaimer/Disclaimer';
import { GetInTouch } from '../../components/GetInTouch/GetInTouch'
import { HowToPlay } from '../../components/HowToPlay/HowToPlay';
// Styles
import './help.styles.css'

export const HelpPage = ({ user }) => {
    return (
        <section className='help-page'>
            {user ? (
                <>
                    <GetInTouch
                        user={user}
                    />
                    <HowToPlay />
                    <Disclaimer />
                </>
            ) : (
                <>
                    <div className="top-gradient">
                        <HowToPlay />
                    </div>
                    <Disclaimer />
                </>
            )}
        </section>
    )
}