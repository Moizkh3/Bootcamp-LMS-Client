import React from 'react';
import BackgroundWrapper from '../../components/common/BackgroundWrapper';
import LoginCard from '../../components/auth/LoginCard';

const LoginPage = () => {
  return (
    <main className="antialiased text-gray-900 selection:bg-blue-100 selection:text-[#0000FF]">
      <BackgroundWrapper >
        <LoginCard/>
      </BackgroundWrapper>
    </main>
  );
};

export default LoginPage;
