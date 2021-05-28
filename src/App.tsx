import React, {Component} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import NavigationManager from './navigation/NavigationManager';
import {_COLORS} from './resources/colors';

class App extends Component {
  render() {
    return (
      <>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={styles.mainContainer.backgroundColor}
        />
        <View style={styles.mainContainer}>
          <NavigationManager />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: _COLORS.appBackground,
  },
});

export default App;
