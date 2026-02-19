import React from 'react';
import { SignUp } from "@clerk/clerk-react";

/**
 * SignUpForm — WBS-1.2
 * GitHub social login removed; only Google + email/password remain.
 * GitHub OAuth should also be disabled in the Clerk Dashboard.
 */
const SignUpForm = () => {
  return (
    <div className="w-full flex justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#1C4645] hover:bg-[#1D4746] text-white',
            card: 'shadow-none w-full',
            headerTitle: 'text-[#1C4645]',
            headerSubtitle: 'text-gray-500',
            socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50 text-gray-700',
            formFieldInput: 'border-gray-200 focus:border-[#3A7573] focus:ring-[#3A7573]/10',
            footerActionLink: 'text-[#3A7573] hover:text-[#1D4746]',
            // Hide GitHub social button (WBS-1.2)
            'socialButtonsBlockButton__github': { display: 'none' },
            // Google and Facebook will appear here if enabled in Clerk Dashboard
            // They use the generic socialButtonsBlockButton styles defined above
          }
        }}
        signInUrl="/auth/signin"
      />
    </div>
  );
};

export default SignUpForm;
