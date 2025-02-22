import { Faculty } from './Faculty';
import { Experts } from './Experts';
import { Students } from './Students';
import { Organizations } from './Organizations';

export const Team = () => {
  return (
    <div id="team">
      <Faculty />
      <Experts />
      <Students />
      <Organizations />
    </div>
  )
}