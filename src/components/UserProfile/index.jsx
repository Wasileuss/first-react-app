import { useEffect } from "react";
import { observer } from "mobx-react";
import { Link } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
import { userProfile } from "../../store/userProfile";
import bg from "../../assets/images/profile-bg.webp";
import './styles.css'


const UserProfile = observer(() => {
    useEffect(() => {
        const email = localStorage.getItem('email')
        userProfile.setUserProfile({first_name: 'Nicky', email: email})
    }, []);
    
    return (
        <div className='user' style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <h2 className="title  animate__animated animate__zoomInDown">User Profile</h2>
            <div className='user__profile'>
                <ul className='user__list'>
                    <li>
                    {userProfile.userProfile.first_name}
                    </li>
                    <li>
                    {userProfile.userProfile.last_name}
                    </li>
                    <li>
                    {userProfile.userProfile.nick_name}
                    </li>
                    <li>
                    {userProfile.userProfile.email}
                    </li>
                    <li>
                    {userProfile.userProfile.phone}
                    </li>
                    <li>
                    {userProfile.userProfile.gender}
                    </li>
                    <li>
                    {userProfile.userProfile.age}
                    </li>
                    <li>
                    {userProfile.userProfile.country}
                    </li>
                    <li>
                    {userProfile.userProfile.city}
                    </li>
                </ul>
                <div className='user__edit'>
                    <Link to="/profile/info">
                        <FaUserEdit />
                    </Link>
                </div> 
            </div>
        </div>
    )
});

export default UserProfile;
