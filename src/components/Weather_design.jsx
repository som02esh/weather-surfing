import { useEffect, useState } from "react";

function Weather_design() {
  const [val,setVal]=useState("")
  const [city,setCity]=useState("Chaibasa")
  const handleChange=(e)=>{
      setVal(e.target.value)
  }
  const handleClick=(e)=>{
      e.preventDefault();
      setVal("")
      setCity(val)
  }

  const [weather, setWeather] = useState({
    title: "",
    desc: "",
    icon: "",
    temp: null,
    humid: null,
    wind_speed: null,
    time: "",
    visibility:null,
    place:"",
  });
  const getWeather = async () => {
    try{
    const APIKEY=import.meta.env.VITE_API_KEY;
    const location = await fetch(
      ` http://api.openweathermap.org/geo/1.0/direct?q=${city},in&limit=2&appid=${APIKEY}`
    );
    const locationResult = await location.json();
    const lat = locationResult[0].lat;
    const lon = locationResult[0].lon;
    const place= locationResult[0].name;

    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric&lang=en`
    );
    const weatherResult = await weatherData.json();

    let unixTimestamp = weatherResult.sys.sunset;
    let normalTime = new Date(unixTimestamp * 1000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    setWeather({
      title: weatherResult.weather[0].main,
      desc: weatherResult.weather[0].description,
      icon:`https://openweathermap.org/img/wn/${weatherResult.weather[0].icon}@4x.png`,
      temp: weatherResult.main.temp,
      humid: weatherResult.main.humidity,
      wind_speed: weatherResult.wind.speed,
      time: normalTime,
      visibility:weatherResult.visibility/1000,
      place,
    });
  }catch(error)
  {
    alert("Enter a valid city");
  }
  };
  useEffect(() => {
    getWeather();
  }, [city])
  return (
    <>
      <div className="container">
        <div className="search">
          <i className="bx bxs-map"></i>
          <input type="text"  value={val} placeholder="Enter Your Location" onChange={handleChange} className="search-inp" />
          <button className="bx bx-search" onClick={handleClick}></button>
        </div>
        <div className="weather-box">
          <div className="box">
            <div className="info-weather">
              <div className="weather">
                <p className="city">{weather.place}</p>
                <img src={weather.icon} alt="" />
                <p className="temperature">{weather.temp}<span>°C</span></p>
                <p className="description">{weather.desc}</p>
                <p className="visibility">visibility : {weather.visibility} km</p>
              </div>
            </div>
          </div>
        </div>
        <div className="weather-details">
          <div className="humidity">
            <i className="bx bx-water"></i>
            <div className="text">
              <div className="info-humidity">
                <span>{weather.humid}%</span>
              </div>
              <p>Humidity</p>
            </div>
          </div>
          <div className="wind">
            <i className="bx bx-wind"></i>
            <div className="text">
              <div className="info-wind">
                <span>{weather.wind_speed}m/s</span>
              </div>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Weather_design;
