import React, { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/main-component/App/App';
import reportWebVitals from './reportWebVitals';
import { ParallaxProvider } from 'react-scroll-parallax';
import './css/font-awesome.min.css';
import './css/themify-icons.css';
import './css/animate.css';
import './css/flaticon.css';
import './sass/style.scss';
import './index.css';
import { ThemeProvider } from './main-component/Extensions/Theme/ThemeProvider'; 
import { PersistGate } from "redux-persist/integration/react";
import {  persistor } from "./store/index";
import { Provider } from "react-redux";
import store from './store/store'
import { AuthProvider } from './main-component/Extensions/AuthProvider';
import './Localization/i18n'
import ErrorBoundary from './main-component/Extensions/Errors/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <HelmetProvider>
        <ParallaxProvider>
            <ErrorBoundary>
                <ThemeProvider>
                    <App />
                    </ThemeProvider>
                    </ErrorBoundary>
            </ParallaxProvider>
            </HelmetProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
