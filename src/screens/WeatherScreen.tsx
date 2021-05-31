import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import ContentContainer from '../components/ContentContainer';
import CText, {CTextMode} from '../components/CText';
import Icon, {IconMode} from '../components/Icon';
import {_COLORS} from '../resources/colors';
import {_DIMENSIONS} from '../resources/dimensions';
import {
  getGeoLocation,
  getWeatherInfo,
  dateTransformer,
} from '../helpers/weatherHelper';
import LinearGradient from 'react-native-linear-gradient';
import {shadow} from '../resources/styles';
import {IopenWeatherResponse} from '../interfaces/apiInterfaces';
import {
  iWeatherState,
  iDailyForecast,
  iHourlyForecast,
} from '../interfaces/weatherInterfaces';
import moment from 'moment';
import 'moment/locale/hu';
moment.locale('hu');

const previousDay18h = moment().startOf('day').valueOf() / 1000 - 60 * 60 * 6;
const _12h = (1000 * 60 * 60 * 12) / 1000;
const _10d = 60 * 60 * 24 * 10;

export enum SelectedView {
  Forecast,
  Precipitation,
}

export default class WeatherScreen extends Component {
  state: iWeatherState = {
    selectedView: SelectedView.Forecast,
    city: '',
    currentTemp: '',
    currentFeelsLike: '',
    currentPrecipitation: '',
    hourlyForecast: [],
    dailyForecast: [],
    lastSynced: '',
    metHuAttrDate: previousDay18h,
    refreshing: false,
    loading: true,
  };

  async componentDidMount() {
    await this.loadContent();
  }

  //gets geolocation, then gets weather data from api
  loadContent = async (): Promise<IopenWeatherResponse | void> => {
    await getGeoLocation().then(async result => {
      if (result) {
        await getWeatherInfo(result.latitude, result.longitude).then(result => {
          //console.log('API result:', JSON.stringify(result, null, 2));
          if (result) return this.setResponse(result);
        });
      }
    });
  };

  //sets weather data in local state
  setResponse = (result: IopenWeatherResponse): void => {
    const lastSynced = dateTransformer(result.current.dt).time;
    const city = result.timezone
      .substr(result.timezone.indexOf('/') + 1, result.timezone.length)
      .replace('_', ' ');
    const currentTemp = `${Math.round(result.current.temp)}°`;
    const currentFeelsLike = `${Math.round(result.current.feels_like)}°`;
    const currentPrecipitation = `${result.hourly[0].pop * 100}%`;
    const hourlyForecast: iHourlyForecast[] = [];
    result.hourly.some((item, index) => {
      hourlyForecast.push({
        time: dateTransformer(item.dt).time,
        temp: `${Math.round(item.temp)}°`,
        pop: `${Math.round(item.pop * 100)}%`,
        icon: item.weather[0].icon,
      });
      if (index >= 5) return true;
    });
    const dailyForecast: iDailyForecast[] = [];
    result.daily.some((item, index) => {
      dailyForecast.push({
        dayOfWeek: dateTransformer(item.dt).dayOfWeek,
        date: dateTransformer(item.dt).dateShort,
        max: `${Math.round(item.temp.max)}°`,
        min: `${Math.round(item.temp.min)}°`,
        rain: `${Math.round(item.rain || 0)}mm`,
        icon: item.weather[0].icon,
      });
      if (index >= 3) return true;
    });
    this.setState({
      city,
      currentTemp,
      currentFeelsLike,
      currentPrecipitation,
      hourlyForecast,
      dailyForecast,
      lastSynced,
      refreshing: false,
      loading: false,
    });
  };

  //tab navigation styling helper
  textModeHelper = (mode: SelectedView) => {
    if (this.state.selectedView === mode) {
      return CTextMode.ActiveContentTab;
    } else {
      return CTextMode.InactiveContentTab;
    }
  };

  //met.hu precipitation image attribute increase
  metHuDateIncrease = () => {
    if (this.state.metHuAttrDate + _12h < moment().valueOf() / 1000) {
      this.setState({
        metHuAttrDate: this.state.metHuAttrDate + _12h,
      });
    }
  };

  //met.hu precipitation image attribute decrease
  metHuDateDecrease = () => {
    if (this.state.metHuAttrDate - _12h > moment().valueOf() / 1000 - _10d) {
      this.setState({
        metHuAttrDate: this.state.metHuAttrDate - _12h,
      });
    }
  };

  //pull refresh method
  onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      await this.loadContent();
    });
  };

  render() {
    //console.log(JSON.stringify(this.state, null, 2));
    return (
      <ContentContainer
        title={'Időjárás'}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}>
        {this.renderTabs()}
        {this.state.selectedView === SelectedView.Forecast &&
          !this.state.loading &&
          this.renderCurrentWeatherBox()}
        {this.state.selectedView === SelectedView.Forecast &&
          !this.state.loading &&
          this.renderHourlyForecastBox()}
        {this.state.selectedView === SelectedView.Precipitation &&
          !this.state.loading &&
          this.renderPrecipitationBox()}
        {!this.state.loading && this.renderDailyForecastBox()}
        {this.state.loading && this.renderLoadingMessage()}
      </ContentContainer>
    );
  }
  private renderTabs = () => (
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
  );
  private renderCurrentWeatherBox = () => (
    <View style={styles.currentWeatherBox}>
      <View style={styles.currentWeatherSectionOne}>
        <CText style={{alignSelf: 'flex-start'}}>{this.state.lastSynced}</CText>
        <View style={styles.currentTempCircle}>
          <CText style={{marginVertical: 5}} fontStyle={styles.currentTempText}>
            {this.state.currentTemp}
          </CText>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon
            mode={IconMode.Location}
            size={18}
            color={_COLORS.appBackground}
          />
          <CText style={{marginVertical: 5}} fontStyle={{fontWeight: 'bold'}}>
            {this.state.city}
          </CText>
        </View>
      </View>
      <View style={styles.dashedDummyView} />
      <View style={styles.currentWeatherSectionTwo}>
        <CText fontStyle={styles.currentWeatherSecondaryText}>Hőérzet</CText>
        <CText
          fontStyle={{...styles.currentWeatherPrimaryText, marginBottom: 10}}>
          {this.state.currentFeelsLike}
        </CText>
        <CText fontStyle={styles.currentWeatherSecondaryText}>Csapadék</CText>
        <CText fontStyle={styles.currentWeatherPrimaryText}>
          {this.state.currentPrecipitation}
        </CText>
      </View>
    </View>
  );
  private renderHourlyForecastBox = () => (
    <View style={styles.hourlyWeatherRow}>
      {this.state.hourlyForecast.map((hourly, index) => {
        return (
          <View style={{...styles.hourlyBarContainer}} key={index}>
            <View style={styles.hourlyBarTop}>
              <CText>{hourly.time}</CText>
              <Icon
                mode={IconMode.Weather}
                iconName={hourly.icon}
                size={22}
                color={_COLORS.appBackground}
                style={{alignSelf: 'center'}}
              />
            </View>
            <LinearGradient
              style={styles.hourlyBarBottom}
              colors={['#ffffff', '#9DCD6C', '#60BE63']}>
              <CText
                fontStyle={{color: 'white', fontWeight: 'bold'}}
                style={{borderBottomWidth: 1, borderBottomColor: 'white'}}>
                {hourly.temp}
              </CText>
              <CText fontStyle={{color: 'white'}}>{hourly.pop}</CText>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );
  private renderDailyForecastBox = () => (
    <LinearGradient
      style={styles.dailyForecastBox}
      colors={['#374472', '#222442']}>
      {this.state.dailyForecast.map((daily, index) => {
        return (
          <View style={styles.dailyForecastItem} key={index}>
            <View>
              <CText fontStyle={styles.dailyForecastDayText}>
                {daily.dayOfWeek}
              </CText>
              <CText fontStyle={styles.dailyForecastDateText}>
                {daily.date}
              </CText>
            </View>
            <View style={styles.dailyForecastSectionTwo}>
              <Icon
                mode={IconMode.Weather}
                iconName={daily.icon}
                size={20}
                color={_COLORS.appBackground}
              />
              <CText fontStyle={{...styles.dailyForecastData}}>
                {daily.rain}
              </CText>
              <CText
                fontStyle={{
                  ...styles.dailyForecastData,
                  color: _COLORS.dailyMaxTemp,
                }}>
                {daily.max}
              </CText>
              <CText
                fontStyle={{
                  ...styles.dailyForecastData,
                  color: _COLORS.dailyMinTemp,
                }}>
                {daily.min}
              </CText>
            </View>
          </View>
        );
      })}
    </LinearGradient>
  );
  private renderPrecipitationBox = () => (
    <>
      <Image
        source={{
          uri: `https://www.met.hu/img/msRh/msRh${
            dateTransformer(this.state.metHuAttrDate).metHuAttr
          }.png`,
        }}
        style={styles.precipitationImg}
        resizeMode="contain"
      />
      <View style={styles.precipitationNavRow}>
        <LinearGradient
          colors={['#5FBC64', '#8CC75E']}
          style={styles.precipitationButton}>
          <Icon
            mode={IconMode.Arrow}
            size={30}
            color={_COLORS.containerBackground}
            onPress={this.metHuDateDecrease}
            style={{margin: 10}}
          />
        </LinearGradient>
        <View style={{margin: 10, alignItems: 'center'}}>
          <CText>{dateTransformer(this.state.metHuAttrDate).dateLong}</CText>
          <CText fontStyle={{fontWeight: 'bold'}}>Dátum</CText>
        </View>
        <LinearGradient
          colors={['#5FBC64', '#8CC75E']}
          style={styles.precipitationButton}>
          <Icon
            mode={IconMode.Arrow}
            size={30}
            color={_COLORS.containerBackground}
            onPress={this.metHuDateIncrease}
            containerStyle={{margin: 10, transform: [{rotateY: '180deg'}]}}
          />
        </LinearGradient>
      </View>
    </>
  );
  private renderLoadingMessage = () => (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row'}}>
        <ActivityIndicator />
        <CText
          style={{marginLeft: 5}}
          fontStyle={{color: _COLORS.secondaryText}}>
          Betöltés
        </CText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: _DIMENSIONS.tabRowVerticalMargin,
    borderBottomColor: _COLORS.tabSeparatorBorder,
    borderBottomWidth: 2,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentWeatherBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: _COLORS.containerBackground,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    ...shadow,
  },
  currentWeatherSectionOne: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentTempCircle: {
    backgroundColor: _COLORS.appBackground,
    width: 65,
    height: 65,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
    margin: 10,
  },
  currentTempText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
  },
  dashedDummyView: {
    height: 100,
    width: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  currentWeatherSectionTwo: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 18,
  },
  currentWeatherSecondaryText: {
    color: _COLORS.currentWeatherSecondaryText,
    marginBottom: 2,
  },
  currentWeatherPrimaryText: {fontWeight: 'bold'},
  hourlyWeatherRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginVertical: 15,
  },
  hourlyBarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
    borderColor: _COLORS.containerBackground,
    borderWidth: 5,
    ...shadow,
  },
  hourlyBarTop: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  hourlyBarBottom: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 40,
  },
  dailyForecastBox: {
    backgroundColor: 'darkblue',
    alignItems: 'center',
    paddingVertical: 7.5,
    marginHorizontal: -_DIMENSIONS.contentHorizontalPadding,
  },
  dailyForecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '90%',
    marginVertical: 7.5,
    backgroundColor: _COLORS.containerBackground,
    borderRadius: 5,
  },
  dailyForecastDayText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 3,
    fontSize: 15,
  },
  dailyForecastDateText: {
    textTransform: 'uppercase',
    color: _COLORS.secondaryText,
  },
  dailyForecastSectionTwo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyForecastData: {
    marginLeft: 12,
    width: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  precipitationImg: {
    width: Dimensions.get('screen').width,
    height: 300,
    alignSelf: 'center',
  },
  precipitationNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  precipitationButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
