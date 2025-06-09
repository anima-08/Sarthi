import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, User, FileText, Search, CheckCircle, AlertCircle, Home, Phone, Mail, MapPin, Calendar, DollarSign, Users, Book, Heart, Briefcase, ChevronRight, Star, Award, Shield, Globe } from 'lucide-react';

const SarthiApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userProfile, setUserProfile] = useState(null);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [applicationForm, setApplicationForm] = useState({});
  
  // Mock user data and schemes
  const mockSchemes = [
    {
      id: 1,
      name: "PM Kisan Samman Nidhi",
      nameHi: "पीएम किसान सम्मान निधि",
      description: "Financial support of ₹6000 per year to small and marginal farmers",
      descriptionHi: "छोटे और सीमांत किसानों को प्रति वर्ष ₹6000 की वित्तीय सहायता",
      eligibility: "Farmers with landholding up to 2 hectares",
      amount: "₹6,000/year",
      category: "Agriculture",
      icon: "🌾"
    },
    {
      id: 2,
      name: "Pradhan Mantri Awas Yojana",
      nameHi: "प्रधानमंत्री आवास योजना",
      description: "Housing for all mission providing financial assistance for home construction",
      descriptionHi: "सभी के लिए आवास मिशन जो घर निर्माण के लिए वित्तीय सहायता प्रदान करता है",
      eligibility: "EWS/LIG/MIG families without pucca house",
      amount: "Up to ₹2.67 Lakh",
      category: "Housing",
      icon: "🏠"
    },
    {
      id: 3,
      name: "Ayushman Bharat",
      nameHi: "आयुष्मान भारत",
      description: "Health insurance coverage up to ₹5 lakh per family per year",
      descriptionHi: "प्रति परिवार प्रति वर्ष ₹5 लाख तक का स्वास्थ्य बीमा कवरेज",
      eligibility: "Families identified in SECC-2011 database",
      amount: "₹5 Lakh/year",
      category: "Healthcare",
      icon: "🏥"
    },
    {
      id: 4,
      name: "PM Mudra Yojana",
      nameHi: "पीएम मुद्रा योजना",
      description: "Micro-finance scheme for small businesses and entrepreneurs",
      descriptionHi: "छोटे व्यवसायों और उद्यमियों के लिए माइक्रो-फाइनेंस योजना",
      eligibility: "Small business owners, entrepreneurs",
      amount: "Up to ₹10 Lakh",
      category: "Business",
      icon: "💼"
    }
  ];

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ];

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(transcript);
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      window.recognition = recognition;
    }
  }, [selectedLanguage]);

  const startListening = () => {
    if (window.recognition) {
      setIsListening(true);
      window.recognition.start();
    }
  };

  const stopListening = () => {
    if (window.recognition) {
      window.recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('scheme') || lowerCommand.includes('योजना')) {
      setCurrentPage('schemes');
      speak(selectedLanguage === 'hi' ? 'योजनाओं की सूची दिखाई जा रही है' : 'Showing available schemes');
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('प्रोफाइल')) {
      setCurrentPage('profile');
      speak(selectedLanguage === 'hi' ? 'प्रोफाइल पेज खोला जा रहा है' : 'Opening profile page');
    } else if (lowerCommand.includes('home') || lowerCommand.includes('घर')) {
      setCurrentPage('home');
      speak(selectedLanguage === 'hi' ? 'होम पेज पर जा रहे हैं' : 'Going to home page');
    }
  };

  const mockEligibilityCheck = (userData) => {
    setIsLoading(true);
    setTimeout(() => {
      // Simple eligibility logic
      const eligible = [];
      if (userData.occupation === 'farmer' && userData.landSize <= 2) {
        eligible.push(mockSchemes[0]);
      }
      if (userData.income <= 300000) {
        eligible.push(mockSchemes[1], mockSchemes[2]);
      }
      if (userData.occupation === 'business') {
        eligible.push(mockSchemes[3]);
      }
      setEligibleSchemes(eligible);
      setIsLoading(false);
      setCurrentPage('results');
    }, 2000);
  };

  const translateText = (text, targetLang) => {
    // Mock translation - in real app, use Google Translate API
    const translations = {
      'Check Eligibility': { hi: 'पात्रता जांचें', en: 'Check Eligibility' },
      'My Profile': { hi: 'मेरी प्रोफाइल', en: 'My Profile' },
      'Available Schemes': { hi: 'उपलब्ध योजनाएं', en: 'Available Schemes' },
      'Apply Now': { hi: 'अभी आवेदन करें', en: 'Apply Now' },
      'Eligible Schemes': { hi: 'पात्र योजनाएं', en: 'Eligible Schemes' }
    };
    return translations[text] ? translations[text][targetLang] : text;
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Sarthi
                </h1>
                <p className="text-gray-600 text-sm">
                  {selectedLanguage === 'hi' ? 'सरकारी योजना सहायक' : 'Government Scheme Navigator'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            {selectedLanguage === 'hi' ? 'सरकारी योजनाओं तक आसान पहुंच' : 'Easy Access to Government Schemes'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {selectedLanguage === 'hi' 
              ? 'AI-powered सहायक जो आपकी पात्रता जांचता है और सबसे उपयुक्त सरकारी योजनाओं की सिफारिश करता है'
              : 'AI-powered assistant that checks your eligibility and recommends the most suitable government schemes'
            }
          </p>
        </div>

        {/* Voice Assistant */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-indigo-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedLanguage === 'hi' ? '🎤 आवाज सहायक' : '🎤 Voice Assistant'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedLanguage === 'hi' 
                ? 'बोलकर योजनाओं के बारे में पूछें या नेविगेट करें'
                : 'Ask about schemes or navigate by speaking'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span>{isListening 
                  ? (selectedLanguage === 'hi' ? 'सुनना बंद करें' : 'Stop Listening') 
                  : (selectedLanguage === 'hi' ? 'बोलना शुरू करें' : 'Start Speaking')
                }</span>
              </button>
              <button
                onClick={() => speak(selectedLanguage === 'hi' ? 'नमस्ते, मैं सार्थी हूं। मैं आपकी सरकारी योजनाओं के लिए सहायता कर सकता हूं।' : 'Hello, I am Sarthi. I can help you with government schemes.')}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Volume2 className="h-5 w-5" />
                <span>{selectedLanguage === 'hi' ? 'परीक्षण करें' : 'Test Voice'}</span>
              </button>
            </div>
            {voiceText && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-indigo-800 font-medium">
                  {selectedLanguage === 'hi' ? 'आपने कहा:' : 'You said:'} "{voiceText}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div 
            onClick={() => setCurrentPage('profile')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-indigo-200"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {translateText('My Profile', selectedLanguage)}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'hi' ? 'अपनी जानकारी दर्ज करें' : 'Enter your information'}
              </p>
            </div>
          </div>

          <div 
            onClick={() => setCurrentPage('schemes')}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {translateText('Available Schemes', selectedLanguage)}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'hi' ? 'सभी योजनाएं देखें' : 'Browse all schemes'}
              </p>
            </div>
          </div>

          <div 
            onClick={() => userProfile && mockEligibilityCheck(userProfile)}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {translateText('Check Eligibility', selectedLanguage)}
              </h3>
              <p className="text-gray-600">
                {selectedLanguage === 'hi' ? 'पात्रता जांचें' : 'Find your eligible schemes'}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {selectedLanguage === 'hi' ? '🌟 मुख्य विशेषताएं' : '🌟 Key Features'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <Globe className="h-12 w-12 text-indigo-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedLanguage === 'hi' ? 'बहुभाषी समर्थन' : 'Multi-language'}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'hi' ? 'हिंदी और अन्य स्थानीय भाषाओं में' : 'Hindi and regional languages'}
              </p>
            </div>
            <div className="text-center p-4">
              <Mic className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedLanguage === 'hi' ? 'आवाज समर्थन' : 'Voice Support'}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'hi' ? 'बोलकर नेविगेट करें' : 'Navigate by speaking'}
              </p>
            </div>
            <div className="text-center p-4">
              <Award className="h-12 w-12 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedLanguage === 'hi' ? 'स्मार्ट मैचिंग' : 'Smart Matching'}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'hi' ? 'AI-आधारित पात्रता जांच' : 'AI-based eligibility check'}
              </p>
            </div>
            <div className="text-center p-4">
              <FileText className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">
                {selectedLanguage === 'hi' ? 'ऑटो फॉर्म भरना' : 'Auto Form Fill'}
              </h4>
              <p className="text-sm text-gray-600">
                {selectedLanguage === 'hi' ? 'स्वचालित आवेदन सहायता' : 'Automated application help'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfilePage = () => {
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      income: '',
      occupation: '',
      landSize: '',
      familySize: '',
      state: '',
      district: '',
      category: '',
      phone: '',
      email: ''
    });

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
      setUserProfile(formData);
      speak(selectedLanguage === 'hi' ? 'प्रोफाइल सहेजी गई' : 'Profile saved successfully');
      setCurrentPage('home');
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {selectedLanguage === 'hi' ? '👤 मेरी प्रोफाइल' : '👤 My Profile'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'उम्र' : 'Age'}
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'उम्र दर्ज करें' : 'Enter age'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'वार्षिक आय (₹)' : 'Annual Income (₹)'}
                </label>
                <input
                  type="number"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'वार्षिक आय' : 'Annual income'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'व्यवसाय' : 'Occupation'}
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">{selectedLanguage === 'hi' ? 'व्यवसाय चुनें' : 'Select occupation'}</option>
                  <option value="farmer">{selectedLanguage === 'hi' ? 'किसान' : 'Farmer'}</option>
                  <option value="laborer">{selectedLanguage === 'hi' ? 'मजदूर' : 'Laborer'}</option>
                  <option value="business">{selectedLanguage === 'hi' ? 'व्यवसाय' : 'Business'}</option>
                  <option value="unemployed">{selectedLanguage === 'hi' ? 'बेरोजगार' : 'Unemployed'}</option>
                  <option value="student">{selectedLanguage === 'hi' ? 'छात्र' : 'Student'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'राज्य' : 'State'}
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">{selectedLanguage === 'hi' ? 'राज्य चुनें' : 'Select state'}</option>
                  <option value="up">{selectedLanguage === 'hi' ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</option>
                  <option value="bihar">{selectedLanguage === 'hi' ? 'बिहार' : 'Bihar'}</option>
                  <option value="mp">{selectedLanguage === 'hi' ? 'मध्य प्रदेश' : 'Madhya Pradesh'}</option>
                  <option value="rajasthan">{selectedLanguage === 'hi' ? 'राजस्थान' : 'Rajasthan'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'पारिवारिक सदस्य' : 'Family Size'}
                </label>
                <input
                  type="number"
                  value={formData.familySize}
                  onChange={(e) => handleInputChange('familySize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'परिवार के सदस्य' : 'Number of family members'}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {selectedLanguage === 'hi' ? 'वापस' : 'Back'}
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
              >
                {selectedLanguage === 'hi' ? 'प्रोफाइल सहेजें' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SchemesPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {selectedLanguage === 'hi' ? '📋 उपलब्ध योजनाएं' : '📋 Available Schemes'}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSchemes.map(scheme => (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{scheme.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedLanguage === 'hi' ? scheme.nameHi : scheme.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  {scheme.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {selectedLanguage === 'hi' ? scheme.descriptionHi : scheme.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {selectedLanguage === 'hi' ? 'राशि:' : 'Amount:'}
                  </span>
                  <span className="font-semibold text-green-600">{scheme.amount}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedScheme(scheme);
                  setCurrentPage('application');
                  speak(selectedLanguage === 'hi' ? `${scheme.nameHi} के लिए आवेदन शुरू कर रहे हैं` : `Starting application for ${scheme.name}`);
                }}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{translateText('Apply Now', selectedLanguage)}</span>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            {selectedLanguage === 'hi' ? 'वापस होम' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );

  const ResultsPage = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {selectedLanguage === 'hi' ? '🎯 आपके लिए पात्र योजनाएं' : '🎯 Your Eligible Schemes'}
        </h2>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              {selectedLanguage === 'hi' ? 'पात्रता जांची जा रही है...' : 'Checking eligibility...'}
            </p>
          </div>
        ) : eligibleSchemes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleSchemes.map(scheme => (
              <div key={scheme.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{scheme.icon}</div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedLanguage === 'hi' ? scheme.nameHi : scheme.name}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {selectedLanguage === 'hi' ? scheme.descriptionHi : scheme.description}
                </p>
                
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <p className="text-green-800 font-semibold text-sm">
                    {selectedLanguage === 'hi' ? '✅ आप इस योजना के लिए पात्र हैं!' : '✅ You are eligible for this scheme!'}
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedScheme(scheme);
                    setCurrentPage('application');
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                >
                  {translateText('Apply Now', selectedLanguage)}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {selectedLanguage === 'hi' ? 'कोई मैचिंग योजना नहीं मिली' : 'No Matching Schemes Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedLanguage === 'hi' 
                ? 'आपकी वर्तमान जानकारी के आधार पर कोई योजना मैच नहीं हुई। कृपया अपनी प्रोफाइल अपडेट करें।'
                : 'No schemes match your current information. Please update your profile.'
              }
            </p>
            <button
              onClick={() => setCurrentPage('profile')}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
            >
              {selectedLanguage === 'hi' ? 'प्रोफाइल अपडेट करें' : 'Update Profile'}
            </button>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
          >
            {selectedLanguage === 'hi' ? 'वापस होम' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  );

  const ApplicationPage = () => {
    const [formData, setFormData] = useState({
      applicantName: userProfile?.name || '',
      fatherName: '',
      address: '',
      bankAccount: '',
      ifscCode: '',
      documents: []
    });

    const handleSubmit = () => {
      speak(selectedLanguage === 'hi' ? 
        `${selectedScheme.nameHi} के लिए आवेदन सफलतापूर्वक जमा किया गया` : 
        `Application for ${selectedScheme.name} submitted successfully`
      );
      setCurrentPage('home');
    };

    if (!selectedScheme) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {selectedLanguage === 'hi' ? 'कोई योजना चुनी नहीं गई' : 'No Scheme Selected'}
            </h3>
            <button
              onClick={() => setCurrentPage('schemes')}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
            >
              {selectedLanguage === 'hi' ? 'योजनाएं देखें' : 'View Schemes'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{selectedScheme.icon}</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedLanguage === 'hi' ? selectedScheme.nameHi : selectedScheme.name}
              </h2>
              <p className="text-gray-600">
                {selectedLanguage === 'hi' ? 'आवेदन फॉर्म' : 'Application Form'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'आवेदक का नाम' : 'Applicant Name'}
                </label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData(prev => ({...prev, applicantName: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'पूरा नाम' : 'Full name'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'पिता का नाम' : 'Father\'s Name'}
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({...prev, fatherName: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'पिता का नाम' : 'Father\'s name'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'पूरा पता' : 'Complete Address'}
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'पूरा पता लिखें' : 'Enter complete address'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'बैंक खाता संख्या' : 'Bank Account Number'}
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData(prev => ({...prev, bankAccount: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'खाता संख्या' : 'Account number'}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {selectedLanguage === 'hi' ? 'IFSC कोड' : 'IFSC Code'}
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData(prev => ({...prev, ifscCode: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder={selectedLanguage === 'hi' ? 'IFSC कोड' : 'IFSC code'}
                />
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                {selectedLanguage === 'hi' ? '📄 आवश्यक दस्तावेज' : '📄 Required Documents'}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {selectedLanguage === 'hi' ? 'आधार कार्ड' : 'Aadhaar Card'}</li>
                <li>• {selectedLanguage === 'hi' ? 'बैंक पासबुक' : 'Bank Passbook'}</li>
                <li>• {selectedLanguage === 'hi' ? 'आय प्रमाण पत्र' : 'Income Certificate'}</li>
                <li>• {selectedLanguage === 'hi' ? 'निवास प्रमाण पत्र' : 'Residence Certificate'}</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setCurrentPage('schemes')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                {selectedLanguage === 'hi' ? 'वापस' : 'Back'}
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>{selectedLanguage === 'hi' ? 'आवेदन जमा करें' : 'Submit Application'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around max-w-md mx-auto">
        <button
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'
          }`}
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs">{selectedLanguage === 'hi' ? 'होम' : 'Home'}</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            currentPage === 'profile' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'
          }`}
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">{selectedLanguage === 'hi' ? 'प्रोफाइल' : 'Profile'}</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('schemes')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            currentPage === 'schemes' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'
          }`}
        >
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs">{selectedLanguage === 'hi' ? 'योजना' : 'Schemes'}</span>
        </button>
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            isListening ? 'text-red-600 bg-red-50' : 'text-gray-600'
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6 mb-1" /> : <Mic className="h-6 w-6 mb-1" />}
          <span className="text-xs">{selectedLanguage === 'hi' ? 'आवाज' : 'Voice'}</span>
        </button>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage />;
      case 'schemes':
        return <SchemesPage />;
      case 'results':
        return <ResultsPage />;
      case 'application':
        return <ApplicationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="pb-20">
      {renderCurrentPage()}
      <BottomNav />
    </div>
  );
};

export default SarthiApp;
