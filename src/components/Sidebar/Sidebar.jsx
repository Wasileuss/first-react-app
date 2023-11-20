import Time from './Time';
import Weather from '../Weather/Weather';

// import ModalWind from "../Modal/ModalWind";

import './sidebar.css';
import bg from "../../assets/images/weather.webp";



function Sidebar() {

    return(
        <div className='sidebar' style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <Time />
            <Weather />
            {/* <ModalWind /> */}
        </div>
    );
}

export default Sidebar;