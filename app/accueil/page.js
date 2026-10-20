import Hero from '../../components/Hero'
import Steps from '../../components/Steps'
import Parcours from '../../components/Parcours'
import Formations from '../../components/Formations'
import Suivi from '../../components/Suivi'
import About from '../../components/About'
export const metadata = { title: 'Accueil — The Winner School' }
export default function Page() {
  return (
    <>
      <Hero />
      <Steps />
      <Parcours first={false} />
      <Formations first={false} />
      <Suivi first={false} />
      <About />
    </>
  )
}
