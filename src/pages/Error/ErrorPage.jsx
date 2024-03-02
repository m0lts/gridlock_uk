import { Link } from 'react-router-dom';
import './error-page.styles.css'

export const ErrorPage = () => {
    return (
        <section className='error-page page-padding bckgrd-black'>
            <h1 className='title'>Error 404</h1>
            <p className='message'>The page you are looking for does not exist.</p>
            <Link to='/' className='link'>
                <button className='btn btn-white'>
                    Return to home
                </button>
            </Link>
        </section>
    );
}