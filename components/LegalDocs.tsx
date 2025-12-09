import React, { useState } from 'react';
import { Icons } from './Icons';

interface LegalPageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageProps> = ({ title, onBack, children }) => (
  <div className="min-h-screen bg-dark-bg text-gray-300 p-6 md:p-10 font-sans">
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-neon-cyan hover:text-white mb-8 transition-colors font-mono text-xs uppercase tracking-wider"
      >
        <Icons.ArrowLeft className="w-4 h-4" /> Back to Auth
      </button>
      
      <h1 className="text-3xl font-black text-white mb-8 tracking-tighter">{title}</h1>
      
      <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white max-w-none space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <LegalPageLayout title="Terms of Service" onBack={onBack}>
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using Olly ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.</p>

    <h3>2. Description of Service</h3>
    <p>The App uses Artificial Intelligence to generate digital artwork and animation prompts based on user inputs. Users can store, view, and export these generations.</p>

    <h3>3. User Accounts</h3>
    <p>You are responsible for maintaining the confidentiality of your account credentials. You are responsible for all activities that occur under your account.</p>

    <h3>4. Generated Content & Ownership</h3>
    <p>You retain ownership of the prompts you input. Subject to the terms of the underlying AI models (Google Gemini), you generally own the rights to the generated images for personal and commercial use, provided you comply with all applicable laws.</p>

    <h3>5. Prohibited Usage</h3>
    <p>You may not use the App to generate content that is illegal, hateful, explicit, violent, or infringes on the intellectual property rights of others. We reserve the right to ban users who violate this policy.</p>

    <h3>6. Disclaimer of Warranties</h3>
    <p>The App is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.</p>
  </LegalPageLayout>
);

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <LegalPageLayout title="Privacy Policy" onBack={onBack}>
    <p>Last updated: {new Date().toLocaleDateString()}</p>

    <h3>1. Information We Collect</h3>
    <p>We collect information you provide directly to us, such as when you create an account, specifically your email address and username. We also store the prompts and images you generate.</p>

    <h3>2. How We Use Your Information</h3>
    <p>We use your information to operate and maintain the App, improve our AI models, and communicate with you about your account.</p>

    <h3>3. Data Storage</h3>
    <p>Your data is stored securely using Supabase. We implement appropriate technical and organizational measures to protect your personal data.</p>

    <h3>4. Third-Party Services</h3>
    <p>We utilize Google Gemini API for content generation. Please review Google's privacy policy regarding how they handle data processed through their AI models.</p>

    <h3>5. Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal information. You can delete your generated assets directly within the app.</p>
  </LegalPageLayout>
);