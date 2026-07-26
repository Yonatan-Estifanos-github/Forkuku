'use client';

import { createContext, useContext, useState, useCallback } from 'react';

export type ActiveView = 'save-the-date' | 'final-invite';

export interface NavState {
  activeView: ActiveView;
  onToggleView: (view: ActiveView) => void;
}

const DEFAULT_VIEW: ActiveView = 'save-the-date';

const ViewContext = createContext<NavState>({
  activeView: DEFAULT_VIEW,
  onToggleView: () => {},
});

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>(DEFAULT_VIEW);

  const onToggleView = useCallback((view: ActiveView) => {
    setActiveView(view);
  }, []);

  return (
    <ViewContext.Provider value={{ activeView, onToggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useNavView = (): NavState => useContext(ViewContext);
