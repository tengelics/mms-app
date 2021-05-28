import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ContentContainerProps {
  title: string;
}

export default class ContentContainer extends Component<ContentContainerProps> {
  render() {
    return (
      <View style={styles.contentContainer}>
        <Text>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'gray',
  },
});
