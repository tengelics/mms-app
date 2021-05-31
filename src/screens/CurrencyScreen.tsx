import React, {Component} from 'react';
import ContentContainer from '../components/ContentContainer';
import {_COLORS} from '../resources/colors';
import UnderDevWarning from '../components/UnderDevWarning';

export default class CurrencyScreen extends Component {
  render() {
    return (
      <ContentContainer
        title={'Deviza'}
        refreshing={false}
        onRefresh={() => {}}>
        <UnderDevWarning />
      </ContentContainer>
    );
  }
}
