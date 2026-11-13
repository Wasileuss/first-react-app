import './footer.css';

import linkedin from '../../assets/icons/ld.svg';
import facebook from '../../assets/icons/fb.svg';
import instagram from '../../assets/icons/inst.svg';
import discord from '../../assets/icons/disc.svg';
import github from '../../assets/icons/gh.svg';

const SOCIAL = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/vasyl-bezkorovainyi-ukraine/', icon: linkedin },
  { name: 'GitHub', href: 'https://github.com/Wasileuss/', icon: github },
  { name: 'Facebook', href: 'https://www.facebook.com/wasyl.bezkorowainyi/', icon: facebook },
  { name: 'Instagram', href: 'https://www.instagram.com/wasyl.lviv/', icon: instagram },
  { name: 'Discord', href: 'https://discord.com/channels/wasyl.lviv/', icon: discord },
];

// External links: plain <a> (not router <Link>) with rel="noopener noreferrer".
function ExternalLink({ href, className, children, label }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__social social">
          {SOCIAL.map((item) => (
            <ExternalLink key={item.name} href={item.href} className="social__link" label={`${item.name} (opens in a new tab)`}>
              <img src={item.icon} alt="" className="social__icon" />
            </ExternalLink>
          ))}
        </div>
        <div className="footer__copyright copyright">
          <p className="copyright__text">Copyright © {year} All rights reserved</p>
          <p>
            <ExternalLink href="https://webuicreator.vercel.app/" className="copyright__link">
              Created by Wasileuss
            </ExternalLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
