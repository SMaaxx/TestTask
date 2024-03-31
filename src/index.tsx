import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ParamEditor from "./ParamEditor";
import {model, params} from "./consts";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ParamEditor params={params} model={model}/>
  </React.StrictMode>
);