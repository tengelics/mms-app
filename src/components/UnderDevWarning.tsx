import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import CText from '../components/CText';
import {_COLORS} from '../resources/colors';

export default class UnderDevWarning extends Component {
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <CText style={styles.container} fontStyle={styles.font}>
          Under development
        </CText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: _COLORS.containerBackground,
    borderWidth: 0.3,
    borderColor: _COLORS.secondaryText,
  },
  font: {
    color: _COLORS.secondaryText,
  },
});
