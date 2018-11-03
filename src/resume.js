import ReactDOM from 'react-dom';
import React from 'react';

import './styles/resume.scss';
import resumeItems from './resumeItems';


const App = () => <>
  <section className="columns">
    <div className="column center-text vertical-margin">
      <div className="logo">
        <span>W</span>
        <span>A</span>
      </div>
    </div>
    <div className="column-divider"/>
    <div className="column center-text vertical-margin">
      <br/>
      <h1>WYATT ADES</h1>
    </div>
    <div className="column-divider"/>
    <div className="column center-text vertical-margin">
      <p className="contact-link">
        <a href="mailto:wyattades@gmail.com">wyattades@gmail.com</a>
      </p>
      <p className="contact-link">
        <a href="https://github.com/wyattades">github.com/wyattades</a>
      </p>
      <p className="contact-link">
        <a href="https://wyattades.com">wyattades.com</a>
      </p>
    </div>
  </section>
  <h4 className="text-hr vertical-margin"/>
  {resumeItems}
</>;

ReactDOM.render(<App/>, document.getElementById('root'));
