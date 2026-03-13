import React from 'react';
import BackgroundWrapper from '../../components/common/BackgroundWrapper';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard';

const ForgotPasswordPage = () => {
  return (
    <main className="antialiased text-gray-900 selection:bg-blue-100 selection:text-[#0000FF]">
      <BackgroundWrapper >
        <ForgotPasswordCard/>
      </BackgroundWrapper>
    </main>
  );
};

export default ForgotPasswordPage;
