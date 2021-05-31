import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

import Hamburger from '../assets/svg/Hamburger.svg';
import Euro from '../assets/svg/Euro.svg';
import LeftArrow from '../assets/svg/LeftArrow.svg';
import Location from '../assets/svg/Location.svg';
import News from '../assets/svg/News.svg';
import Produce from '../assets/svg/Produce.svg';
import Settings from '../assets/svg/Settings.svg';
import Weather from '../assets/svg/Weather.svg';

import OWM_01d from '../assets/svg/OWM_01d.svg';
import OWM_01n from '../assets/svg/OWM_01n.svg';
import OWM_02d from '../assets/svg/OWM_02d.svg';
import OWM_02n from '../assets/svg/OWM_02n.svg';
import OWM_03d from '../assets/svg/OWM_03d.svg';
import OWM_03n from '../assets/svg/OWM_03n.svg';
import OWM_04d from '../assets/svg/OWM_04d.svg';
import OWM_04n from '../assets/svg/OWM_04n.svg';
import OWM_09d from '../assets/svg/OWM_09d.svg';
import OWM_09n from '../assets/svg/OWM_09n.svg';
import OWM_10d from '../assets/svg/OWM_10d.svg';
import OWM_10n from '../assets/svg/OWM_10n.svg';
import OWM_11d from '../assets/svg/OWM_11d.svg';
import OWM_11n from '../assets/svg/OWM_11n.svg';
import OWM_13d from '../assets/svg/OWM_13d.svg';
import OWM_13n from '../assets/svg/OWM_13n.svg';
import OWM_50d from '../assets/svg/OWM_50d.svg';
import OWM_50n from '../assets/svg/OWM_50n.svg';
import OWM_1232n from '../assets/svg/OWM_1232n.svg';

export enum IconMode {
  Hamburger,
  Settings,
  Location,
  Produce,
  Currency,
  Weather,
  News,
  Arrow,
}

interface IconProps {
  mode: IconMode;
  size: number;
  color: string;
  onPress?: () => void;
  iconName?: string;
  iconStyle?: {};
  containerStyle?: {};
  style?: {};
}

export default class Icon extends Component<IconProps> {
  IconName = OWM_01d;

  iconSwitch = () => {
    if (this.props.mode === IconMode.Weather) {
      switch (this.props.iconName) {
        case '01d':
          this.IconName = OWM_01d;
          break;
        case '01n':
          this.IconName = OWM_01n;
          break;
        case '02d':
          this.IconName = OWM_02d;
          break;
        case '02n':
          this.IconName = OWM_02n;
          break;
        case '03d':
          this.IconName = OWM_03d;
          break;
        case '03n':
          this.IconName = OWM_03n;
          break;
        case '04d':
          this.IconName = OWM_04d;
          break;
        case '04n':
          this.IconName = OWM_04n;
          break;
        case '09d':
          this.IconName = OWM_09d;
          break;
        case '09n':
          this.IconName = OWM_09n;
          break;
        case '10d':
          this.IconName = OWM_10d;
          break;
        case '10n':
          this.IconName = OWM_10n;
          break;
        case '11d':
          this.IconName = OWM_11d;
          break;
        case '11n':
          this.IconName = OWM_11n;
          break;
        case '13d':
          this.IconName = OWM_13d;
          break;
        case '13n':
          this.IconName = OWM_13n;
          break;
        case '50d':
          this.IconName = OWM_50d;
          break;
        case '50n':
          this.IconName = OWM_50n;
          break;
        case '1232n':
          this.IconName = OWM_1232n;
          break;
      }
    } else if (this.props.mode === IconMode.Currency) this.IconName = Euro;
    else if (this.props.mode === IconMode.Hamburger) this.IconName = Hamburger;
    else if (this.props.mode === IconMode.Location) this.IconName = Location;
    else if (this.props.mode === IconMode.News) this.IconName = News;
    else if (this.props.mode === IconMode.Arrow) this.IconName = LeftArrow;
    else if (this.props.mode === IconMode.Produce) this.IconName = Produce;
    else if (this.props.mode === IconMode.Settings) this.IconName = Settings;
    else if (this.props.mode === IconMode.Weather) this.IconName = Weather;
  };

  constructor(props: IconProps) {
    super(props);
    this.iconSwitch();
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{...styles.icon, ...this.props.containerStyle}}>
        <this.IconName
          width={this.props.size}
          height={this.props.size}
          fill={this.props.color}
          style={{...styles.icon, ...this.props.iconStyle}}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {},
});
