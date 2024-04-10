// Components
import { Disclaimer } from '../../components/Disclaimer/Disclaimer';
import { GetInTouch } from '../../components/GetInTouch/GetInTouch'
import { HowToPlay } from '../../components/HowToPlay/HowToPlay';
// Styles
import './help.styles.css'

export const HelpPage = () => {

    const userLoggedIn = localStorage.getItem('user');
    const user = userLoggedIn ? JSON.parse(userLoggedIn) : null;

    return (
        <section className='help-page'>
            <GetInTouch
                user={user}
            />
            <HowToPlay />
            <Disclaimer />
        </section>
    )
}