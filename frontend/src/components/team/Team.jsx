import { Faculty } from './Faculty';
import { Experts } from './Experts';
import { Students } from './Students';
import { Organizations } from './Organizations';

export const Team = () => {
  return (
    <div id="team">
      <h1 className='text-3xl font-bold py-2'>Team</h1>
      <Faculty />
      <Experts />
      <Students />
      <Organizations />
    </div>
  )
}