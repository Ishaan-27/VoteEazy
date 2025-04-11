import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Shield, Lock, Fingerprint, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const translations = [
  "Welcome", // English
  "स्वागत है", // Hindi
  "স্বাগতম", // Bengali
  "வரவேற்கிறேன்", // Tamil
  "స్వాగతం", // Telugu
  "સ્વાગત છે", // Gujarati
  "स्वागत", // Marathi
  "സ്വാഗതം", // Malayalam
  "ਸਵਾਗਤ ਹੈ" // Punjabi
];

const metamaskSteps = [
  {
    title: "Install MetaMask",
    description: "Download and install the MetaMask browser extension from the official website.",
    link: "https://metamask.io/download/",
  },
  {
    title: "Create or Import Wallet",
    description: "Create a new wallet or import an existing one using your secret recovery phrase.",
  },
  {
    title: "Connect to Ganache Network",
    description: "Click the network dropdown in MetaMask, select 'Add Network', and enter these details:",
    details: [
      "Network Name: Ganache",
      "RPC URL: http://127.0.0.1:7545",
      "Chain ID: 1337",
      "Currency Symbol: ETH"
    ]
  },
  {
    title: "Connect to VoteEazy",
    description: "Click the 'Connect Wallet' button in the navigation bar to link your MetaMask wallet.",
  }
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [isMetaMaskGuideOpen, setIsMetaMaskGuideOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section with VoteEazy and Election Symbol */}
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <img 
            src="https://dktmdipdmljrgorzzlgl.supabase.co/storage/v1/object/sign/img/eci.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWcvZWNpLnBuZyIsImlhdCI6MTc0MzYyMTgzNCwiZXhwIjoxODMwMDIxODM0fQ.cy21oIvylFNeo3jkZRnYaLhoCfojo-81I8nNtvdPb_E"
            alt="Election Symbol"
            className="h-6 w-auto ml-2"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          <motion.span
            key={translations[index]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {translations[index]}
          </motion.span>{' '}
          to <span className="text-indigo-600">VoteEazy</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Secure, transparent, and easy-to-use blockchain-based voting platform
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-x-4">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <button
            onClick={() => setIsMetaMaskGuideOpen(!isMetaMaskGuideOpen)}
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 hover:bg-indigo-50"
          >
            <Wallet className="h-5 w-5 mr-2" />
            MetaMask Setup Guide
          </button>
        </div>
      </div>

      {/* MetaMask Setup Guide */}
      {isMetaMaskGuideOpen && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How to Set Up MetaMask for Voting
          </h2>
          <div className="grid gap-6">
            {metamaskSteps.map((step, index) => (
              <div key={index} className="border-l-4 border-indigo-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600 mb-2">{step.description}</p>
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Download MetaMask →
                  </a>
                )}
                {step.details && (
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {step.details.map((detail, i) => (
                      <li key={i} className="font-mono bg-gray-50 px-2 py-1 rounded">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Voting</h3>
                <p className="mt-5 text-base text-gray-500">
                  Your vote is protected by advanced blockchain technology and encryption
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Transparent Process</h3>
                <p className="mt-5 text-base text-gray-500">
                  Every vote is recorded on the blockchain, ensuring complete transparency
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Authentication</h3>
                <p className="mt-5 text-base text-gray-500">
                  Simple and secure authentication using MetaMask and email
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;