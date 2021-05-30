import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {_COLORS} from '../resources/colors';

export enum CTextMode {
  Header,
  ActiveContentTab,
  InactiveContentTab,
}

interface CTextProps {
  children: string;
  mode?: CTextMode;
  style?: {};
  onPress?: () => void;
}

export default class CText extends Component<CTextProps> {
  styleHelper = () => {
    switch (this.props.mode) {
      case CTextMode.Header:
        return {...styles.headerStyle, ...this.props.style};
      case CTextMode.ActiveContentTab:
        return {...styles.activeContentTabStyle, ...this.props.style};
      case CTextMode.InactiveContentTab:
        return {...styles.inactiveContentTabStyle, ...this.props.style};
      default:
        return {...this.props.style};
    }
  };
  render() {
    return (
      <Text style={this.styleHelper()} onPress={this.props.onPress}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    color: _COLORS.lightText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 18,
  },
  activeContentTabStyle: {
    color: _COLORS.darkText,
    padding: 5,
  },
  inactiveContentTabStyle: {
    color: _COLORS.secondaryText,
    padding: 5,
  },
});
