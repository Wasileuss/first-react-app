import Time from './Time';
import Weather from '../Weather/Weather';
import bg from '../../assets/images/weather.webp';

import './sidebar.css';

export default function Sidebar() {
  return (
    <aside
      className="sidebar"
      style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
    >
      <Time />
      <Weather />
    </aside>
  );
}
