import React, { useState, useRef } from 'react';

const OTPInput = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call parent onChange
    const newOtp = otp.map((d, idx) => (idx === index ? element.value : d)).join("");
    if (onChange) onChange(newOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center mb-6">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-bold bg-white border border-gray-200 rounded-xl focus:border-[#0000FF] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
