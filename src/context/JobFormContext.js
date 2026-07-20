// src/context/JobFormContext.js
//
// Why context instead of route params: the post-a-job flow is 4 screens deep
// and every step needs to read/patch a shared draft object (category ->
// description/photos -> location -> review). Passing an ever-growing object
// through navigation params works but gets messy to validate and reset.
// A small context provider is simpler to reason about and easy to reset
// after a successful submit.

import React, { createContext, useContext, useState, useCallback } from 'react';

const initialDraft = {
  category: null,        // step 1: { id, label, icon }
  description: '',        // step 2
  photos: [],              // step 2: array of local image uris
  address: '',             // step 3
  coordinates: null,       // step 3: { latitude, longitude }
  addressDetails: '',       // step 3: apartment/unit/notes
};

const JobFormContext = createContext(null);

export function JobFormProvider({ children }) {
  const [draft, setDraft] = useState(initialDraft);

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(initialDraft), []);

  return (
    <JobFormContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </JobFormContext.Provider>
  );
}

export function useJobForm() {
  const ctx = useContext(JobFormContext);
  if (!ctx) throw new Error('useJobForm must be used within a JobFormProvider');
  return ctx;
}
