import React from 'react';
import AllRoute from '../router';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

const App = () => { 
  return (
    <div className="App" id='scrool'>
          <Helmet>
            {/* Primary Meta Tags */}
            <title>LearningHell - Limitless</title>
            <meta name="description" content="The path to learning has no limits." />
            
            {/* Open Graph / Facebook */}
            <meta property="og:url" content="https://www.learninghell.com/Student/Bootcamps" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="LearningHell - Limitless" />
            <meta property="og:description" content="The path to learning has no limits." />
            <meta property="og:image" content="" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content="learninghell.com" />
            <meta property="twitter:url" content="https://www.learninghell.com/Student/Bootcamps" />
            <meta name="twitter:title" content="LearningHell - Limitless" />
            <meta name="twitter:description" content="The path to learning has no limits." />
            <meta name="twitter:image" content="" />
          </Helmet>

          <AllRoute/>
          <ToastContainer position='bottom-right' />
    </div>
  );
}

export default App;