import { useEffect, useState } from 'react';

import './sidebar.css';

// Time in the visitor's own locale (24h/12h as they're used to); date in English like the rest of the UI.
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const dateFormat = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

export default function Time() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="time">
      {/* aria-hidden: a clock that changes every second would be noisy for screen readers */}
      <div aria-hidden="true">{timeFormat.format(now)}</div>
      <time dateTime={now.toISOString().slice(0, 10)}>{dateFormat.format(now)}</time>
    </div>
  );
}
