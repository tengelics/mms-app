import React, {Component} from 'react';
import ContentContainer from '../components/ContentContainer';
import UnderDevWarning from '../components/UnderDevWarning';

export default class NewsScreen extends Component {
  render() {
    return (
      <ContentContainer title={'Hírek'} refreshing={false} onRefresh={() => {}}>
        <UnderDevWarning />
      </ContentContainer>
    );
  }
}
