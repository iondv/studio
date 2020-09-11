import React      from 'react';
import ReactDOM   from 'react-dom';
import Studio     from './Studio';

const container = document.getElementById('studio');
const props = {};

ReactDOM.render(<Studio {...props}/>, container);