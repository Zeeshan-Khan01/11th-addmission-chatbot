import React, { useState } from 'react';
import './OnboardingForm.css';

const OnboardingForm = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ class: '', stream: '', help: '' });

  const questions = [
    {
      label: 'Which class are you in: 11th or 12th?',
      name: 'class',
      options: ['11th', '12th'],
    },
    {
      label: 'Which stream are you interested in or currently studying: Science, Commerce, or Arts?',
      name: 'stream',
      options: ['Science', 'Commerce', 'Arts'],
    },
    {
      label: 'What help do you need most right now?',
      name: 'help',
      options: ['Admission', 'Stream Selection', 'Subjects', 'Career Guidance', 'Study Tips'],
    },
  ];

  const handleSelect = (name, value) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ ...answers, [name]: value });
    }
  };

  const q = questions[step];

  return (
    <div className="onboarding-form">
      <h2>Welcome!</h2>
      <p>{q.label}</p>
      <div className="onboarding-options">
        {q.options.map(option => (
          <button
            key={option}
            className={answers[q.name] === option ? 'selected' : ''}
            onClick={() => handleSelect(q.name, option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OnboardingForm;
