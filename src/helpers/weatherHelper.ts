import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Config from 'react-native-config';
import {IopenWeatherResponse} from '../interfaces/apiInterfaces';
import moment from 'moment';
import 'moment/locale/hu';
moment.locale('hu')

interface geoLocationResult {
    latitude: number,
    longitude: number
}

export const getGeoLocation = (): Promise<geoLocationResult | false> => {
    return new Promise((resolve) => {
        Geolocation.getCurrentPosition((info) => {
            if (info.hasOwnProperty('coords')) {
                resolve({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                })
            } else {
                resolve(false);
            }
          }); 
    })
}

export const getWeatherInfo = (latitude: number, longitude: number): Promise<IopenWeatherResponse | false> => {
    return new Promise((resolve)=> {
        axios
        .post(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&appid=${Config.OPENWEATHER_API_KEY}&units=metric`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        )
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          resolve(false);
        });
    })
  };

  export const dateTransformer = (timeInt: number) => {
    const momentDate = moment(new Date(timeInt*1000));
    const dayOfWeek = momentDate.format('dddd');
    const dateShort = momentDate.format('MMM Do').replace('.', '').replace('.', '');
    const dateLong = momentDate.format('LLL');
    const metHuAttr = momentDate.format('YYYYMMDD_HHmm');
    const time = momentDate.format('HH:mm')
    return {
      dayOfWeek,
      dateShort,
      dateLong,
      metHuAttr,
      time,
    }
  }