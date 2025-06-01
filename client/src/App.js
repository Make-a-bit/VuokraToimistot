import React, { useState } from 'react';
import './App.css';
import Login from './login.js';

const App = () => {
    const [logged, setLogged] = useState(false)
  return (
    <div>
          { !logged && <Login /> }
    </div>
  );
}

export default App;
