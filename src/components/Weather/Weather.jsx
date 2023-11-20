import { useState, useEffect } from 'react';
import axios from 'axios';
import './weather.css';

function Weather() {
    const [data, setData] = useState(JSON.parse(localStorage.getItem('weatherData')) || {});
    const [city, setCity] = useState('');

    const key = 'd89c6c5d26a948c5f70e5573801bed09';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;

    const searchWeather = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            axios.get(url)
            .then((res) => {
                if (res.data.name) {
                    setData(res.data);
                } else {
                    alert("City not found. Try another city.");
                }
            })
            .catch((error) => {
                alert("Error during a request to the server.");
            })
            setCity('');
        }
    }

    useEffect(() => {
        localStorage.setItem('weatherData', JSON.stringify(data));
    }, [data]);

    const clearWeatherData = () => {
        localStorage.removeItem('weatherData');
        setData({});
    };

    const convertUnixTimestampToTime = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000);
        return date.toLocaleTimeString();
    }

    const calculateDayDuration = (sunrise, sunset) => {
        if (sunrise && sunset) {
            const durationInSeconds = sunset - sunrise;
            const hours = Math.floor(durationInSeconds / 3600);
            const minutes = Math.floor((durationInSeconds % 3600) / 60);
            return `${hours} h ${minutes} m`;
        }
        return 'N/A';
    }

    const windDirection = (deg) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(deg / 22.5);
        return directions[index % 16];
    }

    const hPaToMmHg = () => (data.main.pressure * 0.750063755419211).toFixed();

    return (
        <div className="weather">
            <h2 className="weather__title">Weather</h2>
            <div className='weather__input input'>
                <input 
                    className='input__city'
                    id='city'
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder='Enter City'
                    onKeyDown={searchWeather} />
                <div className="input__btns button">
                    <button className="button__search" onClick={searchWeather}>Search</button>
                    <button className="button__clear" onClick={clearWeatherData}>Clear</button>
                </div>
            </div>
            <div className='weather__content'>
                <h2 className="weather__title">{data.name} {data.sys ? <span>{data.sys.country}</span> : null}</h2>
                <div className='weather__info info'>
                    <div>{data.main ? 
                        <div className='info__temp'>
                            <h2>{data.main.temp.toFixed(1)}°C</h2>
                            <img className='info__img' src={`http://openweathermap.org/img/wn/${data.weather ? data.weather[0].icon : null}@2x.png`} 
                            alt={data.weather ? data.weather[0].description : null} />
                        </div> : null} 
                    </div>
                </div>
                <div className={`weather__details details ${({ data }) => data ? 'details--active' : ""}`}>
                <div className='details__feels'>
                        {data.main ? <p>Feels like: {data.main.feels_like.toFixed(1)}°C</p> : null}
                    </div>
                    {/* <div className='details__sky'>
                        {data.weather ? <p>{data.weather[0].main} ({data.weather[0].description})</p> : null}
                    </div> */}
                    <div className='details__pressure'>
                        {data.main ? <p>Pressure: {hPaToMmHg()} mmHg</p> : null}
                    </div>
                    <div className='details__humidity'>
                        {data.main ? <p>Humidity: {data.main.humidity} %</p> : null}
                    </div>
                    <div className='details__wind'>
                        {data.wind ? <p>Wind: {data.wind.speed.toFixed(1)} m/s</p> : null}
                    </div>
                    <div className='details__wind'>
                        {data.wind ? <p>Wind direction: {windDirection(data.wind.deg)}</p> : null}
                    </div>
                    <div className='details__sun'>
                        {data.sys ? <p>Sunrise: {convertUnixTimestampToTime(data.sys.sunrise)}</p> : null}
                    </div>
                    <div className='details__sun'>
                        {data.sys ? <p>Sunset: {convertUnixTimestampToTime(data.sys.sunset)}</p> : null}
                    </div>
                    <div className='details__day-duration'>
                        {data.sys ? <p>Day duration: {calculateDayDuration(data.sys.sunrise, data.sys.sunset)}</p> : null}
                    </div>
                    {/* <div className='details__coordinates'>
                        {data.main ? <p>Latitude: {data.coord.lat}</p> : null} {data.main ? <p>Longitude: {data.coord.lon}</p> : null}
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default Weather;
