'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ActiveView = 'save-the-date' | 'final-invite';

export interface NavState {
  activeView: ActiveView;
  onToggleView: (view: ActiveView) => void;
}

const DEFAULT_VIEW: ActiveView = 'final-invite';
const VIEW_COOKIE = 'view_pref';

const ViewContext = createContext<NavState>({
  activeView: DEFAULT_VIEW,
  onToggleView: () => {},
});

export function ViewProvider({
  children,
  initialView = DEFAULT_VIEW,
}: {
  children: React.ReactNode;
  initialView?: ActiveView;
}) {
  const [activeView, setActiveView] = useState<ActiveView>(initialView);

  const onToggleView = useCallback((view: ActiveView) => {
    setActiveView(view);
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `${VIEW_COOKIE}=${view}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }, []);

  // Layout already renders <html data-theme> to match initialView server-side,
  // so this only needs to react to later manual toggles — no flash on load.
  useEffect(() => {
    document.documentElement.dataset.theme = activeView === 'final-invite' ? 'light' : 'dark';
  }, [activeView]);

  return (
    <ViewContext.Provider value={{ activeView, onToggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useNavView = (): NavState => useContext(ViewContext);
