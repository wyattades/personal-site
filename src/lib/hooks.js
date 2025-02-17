import { useMedia } from 'react-use';

export const useReducedMotion = () => {
  return useMedia('(prefers-reduced-motion)', false);
};
