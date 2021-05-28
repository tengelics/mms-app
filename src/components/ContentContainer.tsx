import React, {Component} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {_COLORS} from '../resources/colors';
import CText, {CTextMode} from '../components/CText';
import Icon, {IconMode} from '../components/Icon';

const borderRadius = 18;

interface ContentContainerProps {
  title: string;
  children?: React.ReactNode;
}

export default class ContentContainer extends Component<ContentContainerProps> {
  render() {
    return (
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.mainContainerContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <CText mode={CTextMode.Header}>{this.props.title}</CText>
          <Icon mode={IconMode.Hamburger} size={40} color={_COLORS.lightText} />
        </View>
        <View style={styles.contentContainer}>{this.props.children}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: _COLORS.appBackground,
  },
  mainContainerContent: {
    minHeight: '100%',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 30,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: _COLORS.containerBackground,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    paddingHorizontal: 18,
  },
});
