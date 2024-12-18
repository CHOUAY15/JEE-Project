import React, { useState } from 'react';
import { SurveillanceTable } from '../../components/surveillance/SurveillanceTable';

const SurveillancePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Surveillance des examens</h1>
      <SurveillanceTable/>
    </div>
  );
};

export default SurveillancePage;