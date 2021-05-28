import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

export enum IconMode {
  Hamburger,
  Settings,
  Location,
  Produce,
  Currency,
  Weather,
  News,
  Previous,
  Next,
}

interface IconProps {
  mode: IconMode;
  size: number;
  color: string;
  onPress?: () => void;
}

export default class Icon extends Component<IconProps> {
  render() {
    return (
      <TouchableOpacity
        style={{
          ...styles.iconContainer,
          width: this.props.size,
          height: this.props.size,
          backgroundColor: this.props.color,
        }}
        onPress={this.props.onPress}
      />
    );
  }
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
  },
});
