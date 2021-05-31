import React, {Component} from 'react';
import ContentContainer from '../components/ContentContainer';
import UnderDevWarning from '../components/UnderDevWarning';

export default class ProduceScreen extends Component {
  render() {
    return (
      <ContentContainer
        title={'Termény'}
        refreshing={false}
        onRefresh={() => {}}>
        <UnderDevWarning />
      </ContentContainer>
    );
  }
}
