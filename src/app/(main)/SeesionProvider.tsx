"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

export const SessionContext = createContext<SessionContext | null>(null);

export const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContext }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const getSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("Use Session must be available to Provider ");
  }
  return context;
};
