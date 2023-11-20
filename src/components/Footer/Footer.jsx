import { Link } from 'react-router-dom';
import './footer.css';

import linkedin from '../../assets/icons/ld.svg';
import facebook from '../../assets/icons/fb.svg';
import instagram from '../../assets/icons/inst.svg';
import discord from '../../assets/icons/disc.svg';
import github from '../../assets/icons/gh.svg';

function Footer() {
    const year = new Date().getFullYear();
    return(
        <div className="footer">
            <div className="footer__container">
                <div className="footer__social social">
                    <Link to={"https://www.linkedin.com/in/vasyl-bezkorovainyi-ukraine/"} target="_blank" className="social__link">
                        <img src={linkedin} alt="linkedin" className="social__icon" />
                    </Link>
                    <Link to={"https://github.com/Wasileuss/"} target="_blank" className="social__link">
                        <img src={github} alt="linkedin" className="social__icon" />
                    </Link>
                    <Link to={"https://www.facebook.com/wasyl.bezkorowainyi/"} target="_blank" className="social__link">
                        <img src={facebook} alt="linkedin" className="social__icon" />
                    </Link>
                    <Link to={"https://www.instagram.com/wasyl.lviv/"} target="_blank" className="social__link">
                        <img src={instagram} alt="linkedin" className="social__icon" />
                    </Link>
                    <Link to={"https://discord.com/channels/wasyl.lviv/"} target="_blank" className="social__link">
                        <img src={discord} alt="linkedin" className="social__icon" />
                    </Link>
                </div>
                <div className="footer__copyright copyright">
                    <p className="copyright__text">Copyright © {year} All rights reserved</p>
                    <p>
                        <Link to={"https://cv-vasyl-bezkorovainyi.netlify.app/"} target="_blank" className="copyright__link">
                            Created by Wasileuss
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;