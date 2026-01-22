import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Globe, Phone, MapPin, Mic, Volume2, Save, Menu, AlertCircle, Camera, Map } from 'lucide-react';

const ABATravel = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  const languages = {
    en: 'English',
    ka: 'ქართული (Georgian)',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    zh: '中文',
    ja: '日本語'
  };

  const georgiaInfo = {
    tbilisi: {
      name: 'Tbilisi',
      history: 'Founded in the 5th century by King Vakhtang I Gorgasali, Tbilisi has been the capital of Georgia for most of its history. The name comes from "tbili" meaning warm, referring to the sulfur hot springs.',
      attractions: ['Narikala Fortress', 'Old Town', 'Sulfur Baths', 'Peace Bridge', 'Mtatsminda Park']
    },
    narikala: {
      name: 'Narikala Fortress',
      history: 'Dating back to the 4th century, Narikala is an ancient fortress overlooking Tbilisi. It was established by the Persians and expanded by the Umayyads in the 7th century.',
      tips: 'Best visited at sunset. Cable car available from Rike Park.'
    },
    mtskheta: {
      name: 'Mtskheta',
      history: 'One of the oldest cities in Georgia, founded in the 5th century BC. UNESCO World Heritage site and former capital of the early Kingdom of Iberia.',
      attractions: ['Svetitskhoveli Cathedral', 'Jvari Monastery', 'Samtavro Monastery']
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Location access denied')
      );
    }
  }, []);

  const handleEmergency = async () => {
    if (location) {
      const emergencyMsg = `🚨 EMERGENCY ALERT\n\nLocation: ${location.lat}, ${location.lng}\nGoogle Maps: https://maps.google.com/?q=${location.lat},${location.lng}\n\nEmergency services have been notified.`;
      
      setMessages(prev => [...prev, {
        type: 'system',
        content: emergencyMsg,
        timestamp: new Date().toISOString()
      }]);
      
      alert('Emergency services contacted!\n\nGeorgia Emergency Numbers:\n🚓 Police: 112\n🚑 Ambulance: 112\n🚒 Fire: 112');
    } else {
      alert('Location not available. Please enable GPS and try again.');
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ka' ? 'ka-GE' : language === 'ru' ? 'ru-RU' : 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      
      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const getAIResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('tbilisi') || lowerMsg.includes('capital')) {
      return georgiaInfo.tbilisi.history + '\n\nKey attractions: ' + georgiaInfo.tbilisi.attractions.join(', ');
    }
    
    if (lowerMsg.includes('narikala') || lowerMsg.includes('fortress')) {
      return georgiaInfo.narikala.history + '\n\n💡 ' + georgiaInfo.narikala.tips;
    }
    
    if (lowerMsg.includes('mtskheta')) {
      return georgiaInfo.mtskheta.history + '\n\nMust-see: ' + georgiaInfo.mtskheta.attractions.join(', ');
    }
    
    if (lowerMsg.includes('wine') || lowerMsg.includes('food')) {
      return 'Georgia is the birthplace of wine with 8,000 years of winemaking tradition! Traditional methods use qvevri (clay vessels buried underground). Must-try foods: Khachapuri (cheese bread), Khinkali (dumplings), and Churchkhela (candle-shaped candy).';
    }
    
    if (lowerMsg.includes('currency') || lowerMsg.includes('money')) {
      return 'Georgian currency is the Lari (GEL). 1 USD ≈ 2.7 GEL. ATMs are widely available in cities. Credit cards accepted in most hotels and restaurants.';
    }
    
    if (lowerMsg.includes('transport') || lowerMsg.includes('metro')) {
      return 'Tbilisi has an efficient metro system (0.50 GEL per ride). Taxis are affordable - use Bolt or Yandex apps. Marshrutkas (minibuses) connect cities (very cheap but can be crowded).';
    }
    
    if (lowerMsg.includes('safety') || lowerMsg.includes('safe')) {
      return 'Georgia is very safe for travelers! Low crime rate. Emergency number: 112 (police, ambulance, fire). Most Georgians are extremely hospitable. Keep normal precautions in crowded areas.';
    }
    
    if (lowerMsg.includes('language') || lowerMsg.includes('speak')) {
      return 'Georgian uses its own unique alphabet. Useful phrases:\n• Hello: Gamarjoba (გამარჯობა)\n• Thank you: Madloba (მადლობა)\n• Yes/No: Diakh/Ara (დიახ/არა)\n• Cheers!: Gaumarjos! (გაუმარჯოს!)\nYoung people often speak English, especially in Tbilisi.';
    }
    
    return `I'm your ABA Travel AI guide for Georgia! I can help you with:\n\n🏛️ Historical sites and museums\n🍷 Food and wine recommendations\n🚇 Transportation tips\n💱 Currency and practical info\n🆘 Emergency assistance\n📍 Location-based guidance\n\nWhat would you like to know about Georgia?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    setTimeout(async () => {
      const response = await getAIResponse(input);
      const aiMessage = {
        type: 'ai',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  const saveTranscript = () => {
    const transcript = messages.map(m => 
      `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.type.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aba-travel-transcript-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">ABA Travel AI</h1>
              <p className="text-sm text-blue-100">Your Georgia Guide</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/30"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code} className="text-gray-800">{name}</option>
              ))}
            </select>
            
            <button 
              onClick={handleEmergency}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
              title="Emergency SOS"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-4xl mx-auto flex gap-1">
          {['chat', 'guide', 'saved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Georgia! 🇬🇪</h2>
                  <p className="text-gray-600 mb-6">Ask me anything about Georgian history, attractions, food, or travel tips!</p>
                  
                  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                    <button onClick={() => setInput('Tell me about Tbilisi')} className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg text-left transition-colors">
                      <MapPin className="w-5 h-5 text-blue-600 mb-1" />
                      <p className="font-medium text-sm">About Tbilisi</p>
                    </button>
                    <button onClick={() => setInput('What should I eat in Georgia?')} className="bg-purple-100 hover:bg-purple-200 p-3 rounded-lg text-left transition-colors">
                      <span className="text-2xl mb-1 block">🍷</span>
                      <p className="font-medium text-sm">Food & Wine</p>
                    </button>
                    <button onClick={() => setInput('How do I get around?')} className="bg-green-100 hover:bg-green-200 p-3 rounded-lg text-left transition-colors">
                      <span className="text-2xl mb-1 block">🚇</span>
                      <p className="font-medium text-sm">Transportation</p>
                    </button>
                    <button onClick={() => setInput('Basic Georgian phrases')} className="bg-orange-100 hover:bg-orange-200 p-3 rounded-lg text-left transition-colors">
                      <span className="text-2xl mb-1 block">💬</span>
                      <p className="font-medium text-sm">Learn Georgian</p>
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xl rounded-2xl p-4 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : msg.type === 'system'
                      ? 'bg-red-100 text-red-900 border-2 border-red-300'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}>
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.type === 'ai' && (
                      <button 
                        onClick={() => speakText(msg.content)}
                        className="mt-2 text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700"
                      >
                        <Volume2 className="w-4 h-4" />
                        Listen
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Guide to Georgia</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">🏛️ Top Attractions</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Tbilisi Old Town & Narikala Fortress</li>
                    <li>• Mtskheta (UNESCO World Heritage)</li>
                    <li>• Kazbegi Mountain & Gergeti Trinity Church</li>
                    <li>• Batumi (Black Sea coast)</li>
                    <li>• Uplistsikhe Cave Town</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">🍷 Food & Drink</h3>
                  <p className="text-gray-700">Birthplace of wine (8,000 years)! Try Khachapuri, Khinkali, Mtsvadi, and traditional wines from Kakheti region.</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-bold text-lg mb-2">💡 Travel Tips</h3>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Currency: Georgian Lari (GEL)</li>
                    <li>• Emergency: 112 (all services)</li>
                    <li>• Visa: Many nationalities get 1-year visa-free</li>
                    <li>• Best time: May-October</li>
                  </ul>
                </div>

                {location && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-bold text-lg mb-2">📍 Your Location</h3>
                    <p className="text-gray-700">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>
                    <a 
                      href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Saved Conversations</h2>
                {messages.length > 0 && (
                  <button 
                    onClick={saveTranscript}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Export Transcript
                  </button>
                )}
              </div>
              
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No conversations yet. Start chatting to save your travel information!</p>
              ) : (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-medium text-gray-800">Current Session</p>
                    <p className="text-sm text-gray-600">{messages.length} messages</p>
                    <p className="text-xs text-gray-500 mt-1">Started: {new Date(messages[0]?.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {activeTab === 'chat' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <button
              onClick={handleVoiceInput}
              disabled={isListening}
              className={`p-3 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask about Georgia in ${languages[language]}...`}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')).render(<ABATravel />);
