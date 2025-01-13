import { Projects } from './projects/Projects';
import { Trainings } from './trainings/Trainings';
import { Team } from './team/Team';

export const Home = () => {
  return (
    <div>
      <Projects/>
      <Trainings />
      <Team />
    </div>
  )
}