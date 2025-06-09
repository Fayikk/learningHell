import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRegisterNewsLetterMutation } from '../../api/newsLetterApi';
import { useNavigate } from 'react-router-dom';

const LeadCapturePage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registerNewsLetter] = useRegisterNewsLetterMutation();
  const navigate = useNavigate();

  // Timer state'ini session storage ile senkronize et
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = sessionStorage.getItem('countdown');
    if (savedTime) {
      const parsed = JSON.parse(savedTime);
      if (Date.now() < parsed.expiry) {
        return parsed.time;
      }
    }
    return { hours: 1, minutes: 59, seconds: 59 };
  });

  // Timer'ı optimize et
  useEffect(() => {
    const expiry = Date.now() + ((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) * 1000);
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.hours === 0 && prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(timer);
          return prevTime;
        }

        const newTime = { ...prevTime };
        
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else {
          newTime.seconds = 59;
          if (newTime.minutes > 0) {
            newTime.minutes--;
          } else {
            newTime.minutes = 59;
            if (newTime.hours > 0) {
              newTime.hours--;
            }
          }
        }

        // Session storage'a kaydet
        sessionStorage.setItem('countdown', JSON.stringify({ 
          time: newTime, 
          expiry 
        }));
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Form submission'ı optimize et
  const handleSubmit = useCallback(async () => {
    if (!email || !email.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerNewsLetter({ email });

      console.log('Kayıt başarılı:', email);

      setShowSuccess(true);
      navigate('/lead-capture-success',{ state: { email } });
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, registerNewsLetter, navigate]);

  // Input değişikliğini optimize et
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value.trim());
  }, []);

  // Benefits array'ini memoize et
  const benefits = useMemo(() => [
    '✅ ChatGPT ile Para Kazanma Teknikleri',
    '✅ 1 Saatte Web Sitesi Yapma',
    '✅ AI ile E-Ticaret Kurma',
    '✅ Sıfırdan Mobil Uygulama Geliştirme'
  ], []);

  // Formatlı zamanı memoize et
  const formattedTime = useMemo(() => ({
    hours: String(timeLeft.hours).padStart(2, '0'),
    minutes: String(timeLeft.minutes).padStart(2, '0'),
    seconds: String(timeLeft.seconds).padStart(2, '0')
  }), [timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated Background - React.memo ile sarmalanmış komponente taşınabilir */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Urgency Timer */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full text-lg font-bold animate-pulse">
              ⏰ Kampanya Bitiyor: 
              <span className="tabular-nums">
                {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol Taraf - Value Proposition */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  ÜCRETSİZ
                </span>
                <br />
                Yapay Zeka Eğitimi
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
                <strong className="text-yellow-400">2024'ün en popüler becerilerini</strong> öğrenin ve 
                <strong className="text-green-400"> maaşınızı 3 katına</strong> çıkarın
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">12,847+ öğrenci</div>
                  <div className="text-sm text-gray-300">bu hafta kaydoldu</div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-lg">
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf - Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Şimdi Başla!
                </h2>
                <p className="text-gray-600">
                  E-postanı gir, <span className="font-bold text-green-600">%100 ücretsiz</span> erişim kazan
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition duration-200"
                    placeholder="E-posta adresinizi girin..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 text-xl font-bold text-white rounded-xl transition duration-200 transform hover:scale-105 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Gönderiliyor...
                    </div>
                  ) : (
                    '🚀 ÜCRETSİZ ERİŞİM KAZAN'
                  )}
                </button>
              </div>

              {/* Trust Signals - React.memo ile sarmalanmış ayrı komponente taşınabilir */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    100% Güvenli
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Spam Yok
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Anında Erişim
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>2,341 kişi şu anda online</span>
              </div>
              <div>⭐⭐⭐⭐⭐ 4.9/5 (8,242 değerlendirme)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LeadCapturePage);