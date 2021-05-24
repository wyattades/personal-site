import React from 'react';

import 'styles/screensaver.scss';
import Fluid from 'components/Fluid';

const getSplashInfo = () => {
  return {
    timeout: Math.ceil(Math.random() * 2000) + 50,
    amount: Math.floor(Math.random() * 3) + 1,
    moveAmount: 5,
  };
};

const ScreenSaverPage = () => (
  <>
    <Fluid getSplashInfo={getSplashInfo} />
  </>
);

export default ScreenSaverPage;
