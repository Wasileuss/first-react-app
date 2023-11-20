import Notes from './Notes';
import TodoNew from './Todos';
import Contacts from '../Contact/Contact';

function Main() {
    return(
        <div className='main'>
            <TodoNew />
            <Contacts />
            <Notes />
        </div>
    );
}

export default Main;