"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface OnboardingData {
  full_name?: string;
  company_name?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  password?: string;
  main_specialty?: string;
  is_other_specialty?: boolean;
  other_specialty_name?: string;
  other_specialty_description?: string;
  zones?: string[];
  sub_services?: string[];
  availability?: any;
  documents?: any;
  interview?: {
    date?: string;
    time?: string;
  };
  exam?: {
    score?: number;
    passed?: boolean;
    completed_at?: string;
  };
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  submitApplication: () => Promise<{ success: boolean; error?: any }>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>({
    zones: [],
    sub_services: [],
    availability: {},
    documents: {}
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const submitApplication = async () => {
    try {
      // 1. Create the Auth User first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email!,
        password: data.password!,
        options: {
          data: {
            full_name: data.full_name,
            role: 'provider'
          }
        }
      });

      if (authError) throw authError;

      // 2. Insert the application record
      const { error } = await supabase
        .from('onboarding_applications')
        .insert([{
          user_id: authData.user?.id, // Link to the new auth user
          full_name: data.full_name,
          company_name: data.company_name,
          email: data.email,
          phone: data.phone,
          birth_date: data.birth_date,
          main_specialty: data.main_specialty,
          is_other_specialty: data.is_other_specialty,
          other_specialty_name: data.other_specialty_name,
          other_specialty_description: data.other_specialty_description,
          zones: data.zones,
          sub_services: data.sub_services,
          availability: data.availability,
          documents: data.documents,
          interview_details: data.interview,
          exam_results: data.exam,
          status: 'application'
        }]);

      if (error) throw error;
      console.log('Onboarding application submitted successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting onboarding application:', error);
      console.error('Error details:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      return { success: false, error };
    }
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, submitApplication }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
