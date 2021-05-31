import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {_COLORS} from '../resources/colors';
import {_DIMENSIONS} from '../resources/dimensions';

export enum CTextMode {
  Header,
  ActiveContentTab,
  InactiveContentTab,
}

interface CTextProps {
  children: string;
  mode?: CTextMode;
  style?: {};
  fontStyle?: {};
  onPress?: () => void;
}

export default class CText extends Component<CTextProps> {
  //style properties based on component mode
  styleHelper = () => {
    switch (this.props.mode) {
      case CTextMode.Header:
        return {...styles.headerStyle};
      case CTextMode.ActiveContentTab:
        return {...styles.activeContentTabStyle};
      case CTextMode.InactiveContentTab:
        return {...styles.inactiveContentTabStyle};
    }
  };

  render() {
    return (
      <TouchableOpacity
        style={{...this.props.style}}
        activeOpacity={1}
        onPress={this.props.onPress}>
        <Text
          style={{
            ...styles.fontStyle,
            ...this.styleHelper(),
            ...this.props.fontStyle,
          }}>
          {this.props.children}
        </Text>
        {this.props.mode === CTextMode.ActiveContentTab && (
          <View
            style={{
              borderBottomWidth: 3,
              borderBottomColor: _COLORS.tabUnderlineColor,
            }}
          />
        )}
        {this.props.mode === CTextMode.InactiveContentTab && (
          <View
            style={{borderBottomWidth: 3, borderBottomColor: 'transparent'}}
          />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  fontStyle: {
    fontSize: 13,
  },
  headerStyle: {
    color: _COLORS.lightText,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: _DIMENSIONS.headerText,
  },
  activeContentTabStyle: {
    color: _COLORS.darkText,
    fontWeight: 'bold',
    padding: 10,
  },
  inactiveContentTabStyle: {
    color: _COLORS.secondaryText,
    fontWeight: 'bold',
    padding: 10,
  },
});
