import React from 'react';
import BackgroundWrapper from '../../components/common/BackgroundWrapper';
import SetPasswordCard from '../../components/auth/SetPasswordCard';

const SetPasswordPage = () => {
  return (
    <main className="antialiased text-gray-900 selection:bg-blue-100 selection:text-[#0000FF]">
      <BackgroundWrapper >
        <SetPasswordCard/>
      </BackgroundWrapper>
    </main>
  );
};

export default SetPasswordPage;
