import PickCity from '../PickCity/PickCity';
import ErrorBox from '../ErrorBox/ErrorBox';
import WeatherSummary from '../WeatherSummary/WeatherSummary';
import Loader from '../Loader/Loader';
import { useCallback } from 'react';
import { useState } from 'react';


const WeatherBox = props => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false); // Dodaj stan error

  const handleCityChange = useCallback((city) => {
    setIsLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=89d7059b534b0e29b63ea960f405eea4&units=metric`)
      .then(res => {
        if (res.status !== 200) {
          throw new Error('Nie udało się znaleźć miasta');
        }
        return res.json();
      })
      .then(data => {
        const newWeatherData = {
          city: data.name,
          temp: data.main.temp,
          icon: data.weather[0].icon,
          description: data.weather[0].main
        };
        setWeatherData(newWeatherData);
        setIsLoading(false);
        setError(false); // Ustaw error na false w przypadku powodzenia
      })
      .catch(error => {
        console.error('Błąd:', error.message);
        setIsLoading(false);
        setError(true); // Ustaw error na true w przypadku błędu
      });
  }, []);

  return (
    <section>
      <PickCity onSubmit={handleCityChange} />
      {isLoading && <Loader />}
      {!isLoading && error && <ErrorBox />} 
      {!isLoading && !error && weatherData && <WeatherSummary data={weatherData} />}
    </section>
  );
};

export default WeatherBox;