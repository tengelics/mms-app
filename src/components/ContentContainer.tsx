import React, {Component} from 'react';
import {View, ScrollView, StyleSheet, RefreshControl} from 'react-native';
import {_COLORS} from '../resources/colors';
import {_DIMENSIONS} from '../resources/dimensions';
import CText, {CTextMode} from '../components/CText';
import Icon, {IconMode} from '../components/Icon';
import {shadow} from '../resources/styles';

interface ContentContainerProps {
  title: string;
  children?: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
}

export default class ContentContainer extends Component<ContentContainerProps> {
  render() {
    return (
      <>
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={styles.mainContainerContent}
          showsVerticalScrollIndicator={false}
          refreshControl={this.renderRefreshControl()}>
          {this.renderHeader()}
          {this.renderContent()}
        </ScrollView>
      </>
    );
  }
  private renderRefreshControl = () => (
    <RefreshControl
      refreshing={this.props.refreshing}
      onRefresh={this.props.onRefresh}
    />
  );
  private renderHeader = () => (
    <View style={styles.headerRow}>
      <CText mode={CTextMode.Header}>{this.props.title}</CText>
      <Icon
        mode={IconMode.Hamburger}
        size={_DIMENSIONS.headerMenuIcon}
        color={_COLORS.lightText}
      />
    </View>
  );
  private renderContent = () => (
    <View style={styles.contentContainer}>{this.props.children}</View>
  );
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
    marginVertical: _DIMENSIONS.headerVerticalMargin,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: _COLORS.containerBackground,
    borderTopLeftRadius: _DIMENSIONS.contentBorderRadius,
    borderTopRightRadius: _DIMENSIONS.contentBorderRadius,
    paddingHorizontal: _DIMENSIONS.contentHorizontalPadding,
    ...shadow,
  },
});
