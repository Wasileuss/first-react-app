import React, { useState, useEffect } from 'react';
import './sidebar.css';

function Time() {
    const [time, setTime] = useState(null);
    const [date, setDate] = useState(null);
  
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString());
            setDate(now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
        };
    
        updateDateTime();
    
        const interval = setInterval(updateDateTime, 1000);
    
        return () => clearInterval(interval);
    }, []);
  
    return (
        <div className='time'>
            <div>{time}</div>
            <div>{date}</div>
        </div>
    );
  }

export default Time;