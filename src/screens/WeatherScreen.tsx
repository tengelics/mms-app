import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import ContentContainer from '../components/ContentContainer';
import CText, {CTextMode} from '../components/CText';
import Icon, {IconMode} from '../components/Icon';
import {_COLORS} from '../resources/colors';
import {
  getGeoLocation,
  getWeatherInfo,
  dateTransformer,
} from '../helpers/weatherHelper';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import 'moment/locale/hu';
moment.locale('hu');

enum SelectedView {
  Forecast,
  Precipitation,
}

export default class WeatherScreen extends Component {
  loadContent = async () => {
    await getGeoLocation().then(async result => {
      if (result) {
        await getWeatherInfo(result.latitude, result.longitude).then(result => {
          //console.log('API result:', JSON.stringify(result, null, 2));
          const lastSynced = dateTransformer(result.current.dt).time;
          const city = result.timezone
            .substr(result.timezone.indexOf('/') + 1, result.timezone.length)
            .replace('_', ' ');
          const currentTemp = `${Math.round(result.current.temp)}°`;
          const currentFeelsLike = `${Math.round(result.current.feels_like)}°`;
          const currentPrecipitation = `${result.hourly[0].pop}%`;
          const hourlyForecast = [];
          result.hourly.some((item, index) => {
            hourlyForecast.push({
              time: dateTransformer(item.dt).time,
              temp: `${Math.round(item.temp)}°`,
              pop: `${Math.round(item.pop)}%`,
              icon: item.weather[0].icon,
            });
            if (index >= 5) return true;
          });
          const dailyForecast = [];
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
          });
        });
      }
    });
  };

  async componentDidMount() {
    await this.loadContent();
  }

  state = {
    selectedView: SelectedView.Forecast,
    city: '',
    currentTemp: 0,
    currentFeelsLike: 0,
    currentPrecipitation: 0,
    hourlyForecast: [],
    dailyForecast: [],
    lastSynced: '',
    metHuAttrDate: moment().startOf('day').valueOf() / 1000 - 60 * 60 * 6,
    refreshing: false,
  };

  textModeHelper = (mode: SelectedView) => {
    if (this.state.selectedView === mode) {
      return CTextMode.ActiveContentTab;
    } else {
      return CTextMode.InactiveContentTab;
    }
  };

  metHuDateIncrease = () => {
    if (
      this.state.metHuAttrDate + (1000 * 60 * 60 * 12) / 1000 <
      moment().valueOf() / 1000
    ) {
      this.setState({
        metHuAttrDate: this.state.metHuAttrDate + (1000 * 60 * 60 * 12) / 1000,
      });
    }
  };

  metHuDateDecrease = () => {
    if (
      this.state.metHuAttrDate - (1000 * 60 * 60 * 12) / 1000 >
      moment().valueOf() / 1000 - 60 * 60 * 24 * 10
    ) {
      this.setState({
        metHuAttrDate: this.state.metHuAttrDate - (1000 * 60 * 60 * 12) / 1000,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      await this.loadContent();
    });
  };

  render() {
    console.log(JSON.stringify(this.state, null, 2));
    return (
      <ContentContainer
        title={'Időjárás'}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}>
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
      <View style={styles.currentWeatherBox}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <CText style={{alignSelf: 'flex-start'}}>
            {this.state.lastSynced}
          </CText>
          <View
            style={{
              backgroundColor: '#5FBB64',
              width: 65,
              height: 65,
              borderRadius: 65,
              justifyContent: 'center',
              alignItems: 'center',
              ...shadow,
            }}>
            <CText
              style={{marginVertical: 5}}
              fontStyle={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 28,
              }}>
              {this.state.currentTemp}
            </CText>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Icon mode={IconMode.Location} size={18} color={'#5FBB64'} />
            <CText style={{marginVertical: 5}} fontStyle={{fontWeight: 'bold'}}>
              {this.state.city}
            </CText>
          </View>
        </View>
        <View
          style={{
            height: 100,
            width: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderStyle: 'dashed',
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingLeft: 18,
          }}>
          <CText fontStyle={{color: '#9FA6AA', marginBottom: 2}}>Hőérzet</CText>
          <CText fontStyle={{fontWeight: 'bold', marginBottom: 10}}>
            {this.state.currentFeelsLike}
          </CText>
          <CText fontStyle={{color: '#9FA6AA', marginBottom: 2}}>
            Csapadék
          </CText>
          <CText fontStyle={{fontWeight: 'bold'}}>
            {this.state.currentPrecipitation}
          </CText>
        </View>
      </View>
      <View style={styles.hourlyWeatherRow}>
        {this.state.hourlyForecast.map((hourly, index) => {
          return (
            <View style={{...styles.hourlyItem}} key={index}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  width: '100%',
                  alignItems: 'center',
                  paddingTop: 10,
                  paddingBottom: 20,
                }}>
                <CText>{hourly.time}</CText>
                <Icon
                  mode={IconMode.Weather}
                  iconName={hourly.icon}
                  size={22}
                  color={'#5FBB64'}
                  style={{alignSelf: 'center'}}
                />
              </View>
              <LinearGradient
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'center',
                  paddingBottom: 10,
                  paddingTop: 40,
                }}
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
    <LinearGradient
      style={styles.forecastWeatherBox}
      colors={['#374472', '#222442']}>
      {this.state.dailyForecast.map((daily, index) => {
        return (
          <View style={styles.forecastWeatherItem} key={index}>
            <View>
              <CText
                fontStyle={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  marginBottom: 3,
                }}>
                {daily.dayOfWeek}
              </CText>
              <CText fontStyle={{textTransform: 'uppercase'}}>
                {daily.date}
              </CText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                mode={IconMode.Weather}
                iconName={daily.icon}
                size={20}
                color={'#5FBB64'}
              />
              <CText style={{...styles.dailyForecastData}}>{daily.max}</CText>
              <CText style={{...styles.dailyForecastData, color: '#EF8433'}}>
                {daily.min}
              </CText>
              <CText style={{...styles.dailyForecastData, color: '#3188CB'}}>
                {daily.rain}
              </CText>
            </View>
          </View>
        );
      })}
    </LinearGradient>
  );
  private renderPrecipitationImage = () => (
    <>
      <Image
        source={{
          uri: `https://www.met.hu/img/msRh/msRh${
            dateTransformer(this.state.metHuAttrDate).metHuAttr
          }.png`,
        }}
        style={{
          width: Dimensions.get('screen').width,
          height: 300,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 15,
          paddingHorizontal: 10,
        }}>
        <LinearGradient
          colors={['#5FBC64', '#8CC75E']}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            mode={IconMode.Arrow}
            size={40}
            color={_COLORS.containerBackground}
            onPress={this.metHuDateIncrease}
            containerStyle={{margin: 10, transform: [{rotateY: '180deg'}]}}
          />
        </LinearGradient>
      </View>
    </>
  );
}

const shadow = {
  shadowColor: '#adb5bd',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.55,
  shadowRadius: 8,
  elevation: 2,
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    borderBottomColor: '#F7F9F8',
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
  hourlyWeatherRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginVertical: 15,
  },
  hourlyItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
    borderColor: _COLORS.containerBackground,
    borderWidth: 5,
    ...shadow,
  },
  forecastWeatherBox: {
    flexDirection: 'column',
    backgroundColor: 'darkblue',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: -20,
  },
  forecastWeatherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: '90%',
    marginBottom: 15,
    backgroundColor: _COLORS.containerBackground,
    borderRadius: 5,
  },
  dailyForecastData: {
    marginLeft: 7,
    fontWeight: 'bold',
  },
});
