import { useMemo } from 'react';

const RULES = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'One number',
    test: (password) => /\d/.test(password),
  },
  {
    id: 'symbol',
    label: 'One special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function usePasswordStrength(password) {
  return useMemo(() => {
    const checks = RULES.map((rule) => ({
      ...rule,
      passed: rule.test(password || ''),
    }));

    const score = checks.filter((item) => item.passed).length;

    let level = 'Weak';
    if (score >= 4) level = 'Strong';
    else if (score >= 3) level = 'Good';
    else if (score >= 2) level = 'Fair';

    return {
      score,
      level,
      checks,
      percent: (score / RULES.length) * 100,
    };
  }, [password]);
}
