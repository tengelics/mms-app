import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {_COLORS} from '../resources/colors';
import ProduceScreen from '../screens/ProduceScreen';
import CurrencyScreen from '../screens/CurrencyScreen';
import WeatherScreen from '../screens/WeatherScreen';
import NewsScreen from '../screens/NewsScreen';
import Icon, {IconMode} from '../components/Icon';
import {shadow} from '../resources/styles';
const Tab = createBottomTabNavigator();
const iconModes = [
  IconMode.Produce,
  IconMode.Currency,
  IconMode.Weather,
  IconMode.News,
];

function MyTabBar({state, descriptors, navigation}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: _COLORS.containerBackground,
        elevation: 10,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.55,
        shadowRadius: 5,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            key={index}>
            <Icon
              mode={iconModes[index]}
              size={30}
              color={
                isFocused ? _COLORS.activeNavColor : _COLORS.inactiveNavColor
              }
              onPress={onPress}
            />
            <Text
              style={{
                color: isFocused
                  ? _COLORS.activeNavColor
                  : _COLORS.inactiveNavColor,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default class NavigationManager extends Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          tabBar={props => <MyTabBar {...props} />}
          initialRouteName={'Időjárás'}>
          <Tab.Screen name="Termény" component={ProduceScreen} />
          <Tab.Screen name="Deviza" component={CurrencyScreen} />
          <Tab.Screen name="Időjárás" component={WeatherScreen} />
          <Tab.Screen name="Hírek" component={NewsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
