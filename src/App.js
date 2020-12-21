import React from 'react';
import './App.css';
import DragnDrop from './DragnDrop/DragnDrop'

function App() {
  return(
    <div>
    <p className="title">სურათის Drag & Drop</p>
    <div className="content">
      <DragnDrop />
    </div>
    </div>
  );
}
export default App;