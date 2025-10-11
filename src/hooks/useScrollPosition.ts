// fitxer: hooks/useScrollPosition.ts

import { useState, useEffect } from 'react';

// Un hook que retorna 'true' si la posició de l'scroll vertical
// és més gran que un llindar que li passem.
export const useScrollPosition = (scrollThreshold: number = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Comprovem si la posició de l'scroll supera el llindar
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Afegim l'event listener
    window.addEventListener('scroll', handleScroll);

    // Important: netegem l'event listener quan el component es desmunta
    // per evitar pèrdues de memòria.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]); // L'efecte només es torna a executar si el llindar canvia

  return isScrolled;
};