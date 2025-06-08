import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion'; // AnimatePresence kaldırıldı çünkü kullanılmıyor
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRegisterNewsLetterMutation } from '../../api/newsLetterApi';

// SVG'leri ayrı component'e taşıyoruz
const SVGIcons = React.memo(() => (
  <>
    {/* SVG'lerin sayısını azalttık ve optimize ettik */}
    <motion.div
      className="absolute left-0 top-0 opacity-10 -translate-x-1/4 -translate-y-1/4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 0.3 }}
    >
      <svg width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-indigo-600" />
      </svg>
    </motion.div>

    <motion.div
      className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ duration: 0.3 }}
    >
      <svg width="200" height="200" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="2" stroke="currentColor" className="text-blue-600" />
      </svg>
    </motion.div>
  </>
));

// Lazy load edilen componentler
const Navbar = lazy(() => import(/* webpackChunkName: "navbar" */'../Navbar/Navbar'));
const Footer = lazy(() => import(/* webpackChunkName: "footer" */'../footer/Footer'));

// Form komponenti ayrı bir bileşene taşındı
const EmailForm = React.memo(({ email, isSubmitting, onSubmit, onChange }) => (
  <form onSubmit={onSubmit} className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-center">
        E-posta Adresiniz
      </label>
      <div className="mt-1">
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="ornek@email.com"
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Gönderiliyor...' : 'Ücretsiz Kupon Kodunu Al'}
      </button>
    </div>

    <p className="text-xs text-gray-500 text-center">
      Kaydolarak, kampanya koşullarını kabul etmiş olursunuz.
    </p>
  </form>
));

const LeadCapturePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addNewsLetter] = useRegisterNewsLetterMutation();
  
  // Timer state'i useMemo ile optimize edildi
  const [timeLeft, setTimeLeft] = useState(() => ({
    hours: 47,
    minutes: 59,
    seconds: 59
  }));

  // Timer effect'i useCallback ile optimize edildi
  const updateTimer = useCallback(() => {
    setTimeLeft(prevTime => {
      const newSeconds = prevTime.seconds - 1;
      if (newSeconds >= 0) return { ...prevTime, seconds: newSeconds };
      
      const newMinutes = prevTime.minutes - 1;
      if (newMinutes >= 0) return { ...prevTime, minutes: newMinutes, seconds: 59 };
      
      const newHours = prevTime.hours - 1;
      if (newHours >= 0) return { hours: newHours, minutes: 59, seconds: 59 };
      
      return prevTime;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Lütfen e-posta adresinizi giriniz');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addNewsLetter({ email });
      if (response.data?.isSuccess) {
        navigate('/lead-capture-success', { state: { email } });
      } else {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, addNewsLetter, navigate]);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);

  return (
    <Suspense fallback={null}>
      <div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden"
        style={{ minHeight: '100vh', contain: 'content' }}
      >
        <SVGIcons />

        <div className="max-w-7xl w-full space-y-12 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ücretsiz Yapay Zeka Ve Yazılım
              </span>
              {" "}Eğitimleriyle
              <br />
              Kariyerinizi İleriye Taşıyın
            </h1>
            <p className="mt-6 text-xl text-gray-600 mx-auto max-w-2xl">
              Özel fırsatlardan yararlanın ve profesyonel kurslarımıza
              <span className="font-semibold text-indigo-600"> ücretsiz kupon kodu </span>
              ile erişin!
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <EmailForm 
                email={email}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onChange={handleEmailChange}
              />
            </motion.div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Aktif Öğrenci</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-200">
              <div className="text-3xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Premium Kurs</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Öğrenci Puanı</div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4 bg-white/50 p-6 rounded-xl backdrop-blur-sm">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg">Premium eğitimlere ücretsiz erişim</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 text-lg">Sınırsız tekrar izleme hakkı</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >              <div className="bg-gradient-to-r from-purple-400 to-purple-500 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 012.944 12c0 2.901 1.027 5.56 2.735 7.634" />
                </svg>
              </div>
                <span className="text-gray-700 text-lg">Sertifika alma imkanı</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default React.memo(LeadCapturePage);