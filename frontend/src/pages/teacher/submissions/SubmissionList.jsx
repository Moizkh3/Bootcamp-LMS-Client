import React from 'react';
import SubmissionCard from './SubmissionCard';

const SubmissionList = ({ submissions }) => {
  return (
    <div className="space-y-6">
      {submissions.map((student, idx) => (
        <SubmissionCard key={idx} student={student} />
      ))}
    </div>
  );
};

export default SubmissionList;
