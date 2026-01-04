import React, { createContext, useContext, useState } from 'react';

/**
 * Context for managing AI Assistant state globally
 */
const AIAssistantContext = createContext();

/**
 * Hook to access AI Assistant context
 */
export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider');
  }
  return context;
};

/**
 * Provider component to wrap your app and manage AI Assistant state
 */
export const AIAssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caseData, setCaseData] = useState({});
  const [width, setWidth] = useState(340); // Default width in pixels

  const openAI = (data = {}) => {
    setCaseData(data);
    setIsOpen(true);
  };

  const closeAI = () => {
    setIsOpen(false);
  };

  const toggleAI = () => {
    setIsOpen(prev => !prev);
  };

  const updateCaseData = (data) => {
    setCaseData(prev => ({ ...prev, ...data }));
  };

  const setAIWidth = (newWidth) => {
    setWidth(newWidth);
  };

  const value = {
    isOpen,
    caseData,
    width,
    openAI,
    closeAI,
    toggleAI,
    updateCaseData,
    setAIWidth
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export default AIAssistantProvider;
