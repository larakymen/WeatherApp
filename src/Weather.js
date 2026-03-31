import axios from 'axios';
import { useEffect, useState} from 'react';

const Weather = (props) => {

    const fetchForecastData = async () => {
        try{
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}&daily=temperature_2m_max,apparent_temperature_max,daylight_duration,sunrise,wind_speed_10m_max,wind_direction_10m_dominant,weather_code,precipitation_sum,sunset&hourly=temperature_2m,visibility,wind_speed_10m,apparent_temperature,precipitation_probability,wind_direction_10m,precipitation,wind_gusts_10m,temperature_80m,weather_code&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,apparent_temperature,weather_code&wind_speed_unit=mph`)

            if(!response.data){
                return
            }

            const farray = {
                current: Object.entries(response.data.current),
                current_units: Object.entries(response.data.current_units),
                daily: Object.entries(response.data.daily),
                daily_units: Object.entries(response.data.daily_units),
                hourly: Object.entries(response.data.hourly),
                hourly_units: Object.entries(response.data.hourly_units)
            }
            
            const response2 = await axios.get(`https://marine-api.open-meteo.com/v1/marine?latitude=${props.latitude}&longitude=${props.longitude}&daily=wave_height_max,wave_direction_dominant,swell_wave_height_max,swell_wave_direction_dominant,wave_period_max,swell_wave_period_max&hourly=wave_height,sea_level_height_msl,wave_direction,swell_wave_height,swell_wave_direction,sea_surface_temperature,wave_period,swell_wave_period&current=wave_height,wave_direction,sea_level_height_msl,sea_surface_temperature,swell_wave_direction,swell_wave_height,wave_period,swell_wave_period`)

            if(!response2.data){
                return
            }
            
            const marray = {
                current: Object.entries(response2.data.current),
                current_units: Object.entries(response2.data.current_units),
                daily: Object.entries(response2.data.daily),
                daily_units: Object.entries(response2.data.daily_units),
                hourly: Object.entries(response2.data.hourly),
                hourly_units: Object.entries(response2.data.hourly_units)
            }

            props.sendData({forecast:farray, marine:marray})

           
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() =>{

        if(props.latitude === '' || props.longitude === ''){
            return
        }

        fetchForecastData();

    }, [props.latitude,props.longitude]);
}

export default Weather;
//Master link for the forecast

//https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,apparent_temperature_max,daylight_duration,sunrise,wind_speed_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,visibility,wind_speed_10m,apparent_temperature,precipitation_probability,wind_direction_10m,precipitation,wind_gusts_10m,temperature_80m&current=temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wind_gusts_10m,apparent_temperature&wind_speed_unit=mph

//Master link for the sea forecast

//https://marine-api.open-meteo.com/v1/marine?latitude=54.544587&longitude=10.227487&daily=wave_height_max,wave_direction_dominant,swell_wave_height_max,swell_wave_direction_dominant&hourly=wave_height,sea_level_height_msl,wave_direction,swell_wave_height,swell_wave_direction,sea_surface_temperature&current=wave_height,wave_direction,sea_level_height_msl,sea_surface_temperature,swell_wave_direction,swell_wave_height