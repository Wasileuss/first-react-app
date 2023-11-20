import { useState } from "react";
import { observer } from "mobx-react";
import { Link } from 'react-router-dom';
import { SlClose } from "react-icons/sl";
import { AiOutlineFileDone } from "react-icons/ai";

import { userProfile } from "../../../store/userProfile";

import './styles.css';

const UserInfo = observer(() => {
  const [userInfo, setUserInfo] = useState({...userProfile.userProfile});
  console.log(userInfo);

  const changeUserInfo = (e) => {
    setUserInfo({...userInfo, [e.target.name]: e.target.value})
  }

  const updateUserInfo = () => {
    userProfile.setUserProfile({...userInfo})
  }

  return (
    <div className='user-info'>
      <div className='user-info__content'>
        <Link to="/profile">
          <div className='user-info__content__close'>
            <SlClose />
          </div>
        </Link>
        <h2 className="user-info__title">
          User profile
        </h2>
        <ul className="user-info__list">
          <li className="user-info__item">
            <label htmlFor="first_name">first name</label>
            <input className="user-info__input"
              type="text"
              name="first_name"
              value={userInfo.first_name}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="last_name">last name</label>
            <input className="user-info__input"
              type="text"
              name="last_name"
              value={userInfo.last_name}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="nick_name">nick name</label>
            <input className="user-info__input"
              type="text"
              name="nick_name"
              value={userInfo.nick_name}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="email">email</label>
            <input className="user-info__input"
              type="text"
              name="email"
              value={userInfo.email}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="phone">phone</label>
            <input className="user-info__input"
              type="text"
              name="phone"
              value={userInfo.phone}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="gender">gender</label>
            <input className="user-info__input"
              type="text"
              name="gender"
              value={userInfo.gender}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="age">age</label>
            <input className="user-info__input"
              type="text"
              name="age"
              value={userInfo.age}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="country">country</label>
            <input className="user-info__input"
              type="text"
              name="country"
              value={userInfo.country}
              onChange={changeUserInfo}
            />
          </li>
          <li className="user-info__item">
            <label htmlFor="city">city</label>
            <input className="user-info__input"
              type="text"
              name="city"
              value={userInfo.city}
              onChange={changeUserInfo}
            />
          </li>
        </ul>
        <button onClick={updateUserInfo}>
          <Link className="user-info__done" to="/profile">
                <p>
                    Update Profile
                </p>
                <AiOutlineFileDone />
          </Link>
        </button>
      </div>
    </div>
  )
});

export default UserInfo;
