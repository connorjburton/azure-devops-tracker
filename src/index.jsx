import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Auth from './prelude/auth.jsx';
import reducers from './reducers/index.js';

const store = createStore(reducers);

render(<Provider store={store}><Auth /></Provider>, document.getElementById('root'));
