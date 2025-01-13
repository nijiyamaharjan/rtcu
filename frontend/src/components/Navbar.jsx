import { Link } from 'react-scroll';

export const Navbar = () => {
  return (
    <div className='px-10'>
      <ul className="flex gap-10">
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