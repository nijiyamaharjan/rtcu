import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <div className='px-10'>
      <ul className="flex gap-10">
        <li>
          <RouterLink to="/">
            Home
          </RouterLink>
        </li>
        <li>
          <Link to="projects">
            Projects
          </Link>
        </li>
        <li>
          <Link to="trainings">
            Trainings
          </Link>
        </li>
        <li>
          <Link to="team">
            Team
          </Link>
        </li>
      </ul>
    </div>
  )
}