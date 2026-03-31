import FutureWeather from "./futureWeather"

// forecast.current indices (Object.entries of Open-Meteo response):
// [2]=temperature_2m [3]=precipitation [4]=wind_speed_10m [5]=wind_direction_10m
// [6]=wind_gusts_10m [7]=apparent_temperature [8]=weather_code
//
// forecast.daily indices:
// [0]=time [1]=temperature_2m_max [2]=apparent_temperature_max [3]=daylight_duration
// [4]=sunrise [5]=wind_speed_10m_max [6]=wind_direction_10m_dominant [7]=weather_code [8]=precipitation_sum [9]=sunset
//
// forecast.hourly indices:
// [0]=time [1]=temperature_2m [2]=visibility [3]=wind_speed_10m [4]=apparent_temperature
// [5]=precipitation_probability [6]=wind_direction_10m [7]=precipitation [8]=wind_gusts_10m
//
// marine.current indices:
// [2]=wave_height [3]=wave_direction [4]=sea_level_height_msl [5]=sea_surface_temperature
// [6]=swell_wave_direction [7]=swell_wave_height [8]=wave_period [9]=swell_wave_period
//
// marine.daily indices:
// [0]=time [1]=wave_height_max [2]=wave_direction_dominant [3]=swell_wave_height_max
// [4]=swell_wave_direction_dominant [5]=wave_period_max [6]=swell_wave_period_max
//
// marine.hourly indices:
// [0]=time [1]=wave_height [2]=sea_level_height_msl [3]=wave_direction [4]=swell_wave_height
// [5]=swell_wave_direction [6]=sea_surface_temperature [7]=wave_period [8]=swell_wave_period

const ForecastModal = ({ wData, modalClick, darkMode }) => {
    if (!wData || !modalClick) return null;

    const f = wData.forecast;
    const m = wData.marine;

    if (modalClick === "Temperature") return (
        <FutureWeather
            currentVal={f.current[2][1]}
            currentLabel={"Wind Chill: feels like " + f.current[7][1] + "°C"}
            DailyTimeArr={f.daily[0][1]}
            DailyValArr={f.daily[1][1]}
            DailyIconArr={f.daily[7][1]}
            HourlyTimeArr={f.hourly[0][1]}
            HourlyValArr={f.hourly[1][1]}
            units="°C"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Precipitation") return (
        <FutureWeather
            currentVal={f.current[3][1]}
            currentLabel={"Current precipitation"}
            DailyTimeArr={f.daily[0][1]}
            DailyValArr={f.daily[8][1]}
            DailyIconArr={f.daily[7][1]}
            HourlyTimeArr={f.hourly[0][1]}
            HourlyValArr={f.hourly[7][1]}
            units="mm"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wind Speed") return (
        <FutureWeather
            currentVal={f.current[4][1]}
            currentLabel={"Gusts: " + f.current[6][1] + " mph"}
            DailyTimeArr={f.daily[0][1]}
            DailyValArr={f.daily[5][1]}
            DailyIconArr={f.daily[7][1]}
            HourlyTimeArr={f.hourly[0][1]}
            HourlyValArr={f.hourly[3][1]}
            units="mph"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wind Direction") return (
        <FutureWeather
            currentVal={f.current[5][1]}
            currentLabel={"Wind Direction"}
            DailyTimeArr={f.daily[0][1]}
            DailyValArr={f.daily[6][1]}
            DailyIconArr={f.daily[7][1]}
            HourlyTimeArr={f.hourly[0][1]}
            HourlyValArr={f.hourly[6][1]}
            units="°"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wind Gusts") return (
        <FutureWeather
            currentVal={f.current[6][1]}
            currentLabel={"Wind Gusts"}
            DailyTimeArr={f.daily[0][1]}
            DailyValArr={f.daily[5][1]}
            DailyIconArr={f.daily[7][1]}
            HourlyTimeArr={f.hourly[0][1]}
            HourlyValArr={f.hourly[8][1]}
            units="mph"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wave Height") return (
        <FutureWeather
            currentVal={m.current[2][1]}
            currentLabel={"Direction: " + m.current[3][1] + "°"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[1][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[1][1]}
            units="m"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wave Direction") return (
        <FutureWeather
            currentVal={m.current[3][1]}
            currentLabel={"Wave Direction"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[2][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[3][1]}
            units="°"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Sea Level Height") return (
        <FutureWeather
            currentVal={m.current[4][1]}
            currentLabel={"Sea Level Height"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[1][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[2][1]}
            units="m"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Sea Surface Temperature") return (
        <FutureWeather
            currentVal={m.current[5][1]}
            currentLabel={"Sea Surface Temperature"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[1][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[6][1]}
            units="°C"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Swell Direction") return (
        <FutureWeather
            currentVal={m.current[6][1]}
            currentLabel={"Swell Direction"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[4][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[5][1]}
            units="°"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Swell Height") return (
        <FutureWeather
            currentVal={m.current[7][1]}
            currentLabel={"Direction: " + m.current[6][1] + "°"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[3][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[4][1]}
            units="m"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Wave Period") return (
        <FutureWeather
            currentVal={m.current[8][1]}
            currentLabel={"Wave Period — lower is choppier"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[5][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[7][1]}
            units="s"
            darkMode={darkMode}
        />
    );
    if (modalClick === "Swell Period") return (
        <FutureWeather
            currentVal={m.current[9][1]}
            currentLabel={"Swell Wave Period"}
            DailyTimeArr={m.daily[0][1]}
            DailyValArr={m.daily[6][1]}
            HourlyTimeArr={m.hourly[0][1]}
            HourlyValArr={m.hourly[8][1]}
            units="s"
            darkMode={darkMode}
        />
    );

    return null;
}

export default ForecastModal;
