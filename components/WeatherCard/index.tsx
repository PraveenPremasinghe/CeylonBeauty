"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./index.css";

interface WeatherData {
  location: { name: string };
  current: {
    temperature: number;
    weather_descriptions: string[];
    humidity: number;
  };
}

// Declare props for the WeatherCard component
interface WeatherCardProps {
  isScrolledPastHero: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ isScrolledPastHero }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_WEATHERSTACK_API_KEY;
  const location = 'Colombo';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${location}`);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);



  return (
    <div
      className={`weather-card p-4 relative ${
        isScrolledPastHero ? "scrolled" : ""
      }`}
    >
      <div className="text-MD">Sri Lanka</div>

      <div className="flex justify-between items-center pt-1 pb-1">
        <div className="text-4xl font-extrabold">
          {weatherData ? `${weatherData.current.temperature}°C` : 'Loading...'}
        </div>
        <div>
          <Image
            width={100}
            height={50}
            src="/images/shape/cloud-96.png"
            alt="Weather Icon"
            className="absolute top-0 right-0 z-999 "
          />
        </div>
      </div>

      <div className="font-semibold">
        {weatherData ? weatherData.current.weather_descriptions[0] : 'Loading...'}
      </div>


    </div>
  );
};
