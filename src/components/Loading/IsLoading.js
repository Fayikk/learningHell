import React from 'react';
import Loading from 'react-loading-components';

export default function IsLoading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loading type='ball_triangle' width={100} height={100} fill='#f44242' />
    </div>
  )
}
