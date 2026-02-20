import { useState, useCallback } from 'react';

const getInitialBootState = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  return !sessionStorage.getItem('advyon_booted');
};

export function useBootSequence() {
  const [shouldBoot, setShouldBoot] = useState(getInitialBootState);

  const completeBoot = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('advyon_booted', 'true');
    }
    setShouldBoot(false);
  }, []);

  return { shouldBoot, completeBoot };
}
