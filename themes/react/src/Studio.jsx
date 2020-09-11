import React        from 'react';
import { Provider } from 'react-redux'
import PropTypes    from 'prop-types';

import styles from './Studio.less';

class Studio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
console.log(styles);
    return <Provider store={store}>
      <div>Hello world</div>
    </Provider>;
  }
}

export default Studio;
