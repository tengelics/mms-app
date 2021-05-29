import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import ContentContainer from '../components/ContentContainer';
import CText, {CTextMode} from '../components/CText';
import Icon, {IconMode} from '../components/Icon';
import {_COLORS} from '../resources/colors';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import Config from 'react-native-config';

enum SelectedView {
  Forecast,
  Precipitation,
}

export default class WeatherScreen extends Component {

  getWeatherInfo = () => {
    axios
      .post(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&exclude=minutely,alerts&appid=${Config.OPENWEATHER_API_KEY}&units=metric`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      )
      .then((res) => {
        console.log('res.data: ', res.data)
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  componentDidMount () {
    Geolocation.getCurrentPosition((info) => {
      if (info) {
        this.setState(
          {
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
          },
          () => {
            this.getWeatherInfo();
          },
        );
      } else {
        this.setState({initialLoadingMessage: 'Geolocation unsuccessful'});
      }
    });
  }
  
  state = {
    selectedView: SelectedView.Forecast,
    latitude: 0,
    longitude: 0
  };

  textModeHelper = (mode: SelectedView) => {
    if (this.state.selectedView === mode) {
      return CTextMode.ActiveContentTab;
    } else {
      return CTextMode.InactiveContentTab;
    }
  };

  render() {
    return (
      <ContentContainer title={'Időjárás'}>
        <View style={styles.tabRow}>
          <View style={styles.tabGroup}>
            <CText
              mode={this.textModeHelper(SelectedView.Forecast)}
              onPress={() => {
                this.setState({selectedView: SelectedView.Forecast});
              }}>
              Előrejelzés
            </CText>
            <CText
              mode={this.textModeHelper(SelectedView.Precipitation)}
              onPress={() => {
                this.setState({selectedView: SelectedView.Precipitation});
              }}>
              Csapadékösszeg
            </CText>
          </View>
          <Icon mode={IconMode.Settings} color={_COLORS.darkText} size={20} />
        </View>
        {this.state.selectedView === SelectedView.Forecast &&
          this.renderForecast()}
        {this.state.selectedView === SelectedView.Precipitation &&
          this.renderPrecipitation()}
      </ContentContainer>
    );
  }
  private renderForecast = () => (
    <>
      <View style={styles.currentWeatherBox} />
      <View style={styles.hourlyWeatherRow}>
        <View style={styles.hourlyItem} />
        <View style={styles.hourlyItem} />
        <View style={styles.hourlyItem} />
        <View style={styles.hourlyItem} />
        <View style={styles.hourlyItem} />
        <View style={styles.hourlyItem} />
      </View>
      {this.renderForecastBox()}
    </>
  );
  private renderPrecipitation = () => (
    <>
      {this.renderPrecipitationImage()}
      {this.renderForecastBox()}
    </>
  );
  private renderForecastBox = () => (
    <View style={styles.forecastWeatherBox}>
      <View style={styles.forecastWeatherItem} />
      <View style={styles.forecastWeatherItem} />
      <View style={styles.forecastWeatherItem} />
      <View style={styles.forecastWeatherItem} />
    </View>
  );
  private renderPrecipitationImage = () => (
    <>
      <View
        style={{height: 150, backgroundColor: 'black', marginHorizontal: -20}}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{width: 50, height: 50, backgroundColor: 'blue', margin: 10}}
        />
        <View
          style={{width: 150, height: 50, backgroundColor: 'blue', margin: 10}}
        />
        <View
          style={{width: 50, height: 50, backgroundColor: 'blue', margin: 10}}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentWeatherBox: {
    backgroundColor: 'lightgray',
    height: 140,
    borderRadius: 15,
  },
  hourlyWeatherRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginVertical: 15,
  },
  hourlyItem: {
    flex: 1,
    height: 140,
    backgroundColor: 'lightgray',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  forecastWeatherBox: {
    flexDirection: 'column',
    backgroundColor: 'darkblue',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: -20,
  },
  forecastWeatherItem: {
    height: 30,
    width: '90%',
    marginBottom: 15,
    backgroundColor: _COLORS.containerBackground,
    borderRadius: 5,
  },
});
