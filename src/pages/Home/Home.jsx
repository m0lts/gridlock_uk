import { NextEvent } from './NextEvent/NextEvent'
import { AccountStats } from './AccountStats/AccountStats'
import { GridlockStats } from './GridlockStats/GridlockStats'
import './home.styles.css'

export const Home = () => {
    return (
        <section className="home">
            <NextEvent />
            <AccountStats />
            <GridlockStats />
        </section>
    )
}