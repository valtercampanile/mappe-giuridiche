import { useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useNavHistory(initialId?: string) {
  const [history, setHistory] = useState<string[]>(initialId ? [initialId] : []);
  const [currentIndex, setCurrentIndex] = useState(initialId ? 0 : -1);

  const currentId = currentIndex >= 0 ? history[currentIndex] : undefined;
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const navigate = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const next = [...prev.slice(0, currentIndex + 1), id];
        if (next.length > MAX_HISTORY) next.shift();
        return next;
      });
      setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
    },
    [currentIndex],
  );

  const goBack = useCallback(() => {
    if (canGoBack) setCurrentIndex((i) => i - 1);
  }, [canGoBack]);

  const goForward = useCallback(() => {
    if (canGoForward) setCurrentIndex((i) => i + 1);
  }, [canGoForward]);

  return { currentId, history, currentIndex, navigate, goBack, goForward, canGoBack, canGoForward };
}
