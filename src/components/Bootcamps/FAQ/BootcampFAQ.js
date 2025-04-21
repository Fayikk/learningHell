import React from 'react';
import './BootcampFAQ.css';

const BootcampFAQ = ({ bootcampTitle }) => {
  // Static FAQ data that can be customized later
  const faqItems = [
    {
      question: "Bootcamp programına kimler katılabilir?",
      answer: "Bootcamp programlarımız, konusuna ilgi duyan ve öğrenmeye istekli herkese açıktır. Bazı programlar için belirli bir temel bilgi gerekebilir, bu durumda program açıklamasında belirtilir."
    },
    {
      question: "Bootcamp kayıt ücretine neler dahildir?",
      answer: "Bootcamp kayıt ücreti, tüm kurs materyallerine erişimi, canlı oturumları, özel projeler için mentörlük desteğini ve kurs sonunda verilecek sertifikayı kapsamaktadır."
    },
    {
      question: "Bootcamp programını tamamladıktan sonra sertifika alacak mıyım?",
      answer: "Evet, bootcamp programını başarıyla tamamlayan tüm katılımcılara dijital ve basılı sertifika verilmektedir."
    },
    {
      question: "Online bootcamp programlarına erişim ne kadar süreyle açık olacak?",
      answer: "Online bootcamp materyallerine program süresince ve program bittikten sonra 6 ay boyunca erişim sağlayabilirsiniz."
    },
    {
      question: "Bootcamp programını aldıktan sonra vazgeçersem iade yapılıyor mu?",
      answer: "Bootcamp başlangıç tarihinden 7 gün öncesine kadar yapılan iptallerde %90 iade yapılmaktadır. Daha sonraki iptallerde veya program başladıktan sonra iade yapılmamaktadır."
    },
    {
      question: "Bootcamp oturumlarını kaçırırsam ne olur?",
      answer: "Tüm canlı oturumlar kaydedilmektedir ve katılımcılar bu kayıtlara sonradan erişebilirler. Ancak, programın interaktif yapısından en iyi şekilde faydalanmak için oturumlara canlı olarak katılmanızı öneririz."
    },
    {
      question: "Bootcamp programı için herhangi bir ekipmana ihtiyacım var mı?",
      answer: "Çoğu bootcamp programı için internet bağlantısı olan bir bilgisayar yeterlidir. Bazı özel programlar için ek donanım veya yazılım gereksinimi olabilir, bu durumda program açıklamasında belirtilecektir."
    },
    {
      question: "Bootcamp sırasında teknik sorunlar yaşarsam yardım alabilir miyim?",
      answer: "Evet, bootcamp süresince teknik sorunlarınız için destek ekibimize ulaşabilirsiniz. Size en kısa sürede yardımcı olacağız."
    }
  ];

  return (
    <div className="bootcamp-faq-container">
      <div className="faq-header">
        <h2>Sıkça Sorulan Sorular</h2>
        <p className="faq-intro">
          {bootcampTitle || "Bootcamp"} programıyla ilgili merak edilen sorular ve yanıtları aşağıda bulabilirsiniz.
        </p>
      </div>
      
      <div className="faq-list">
        {faqItems.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">{faq.question}</summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
      
      <div className="faq-contact">
        <p>Başka sorularınız mı var? <a href="/contact">Bizimle iletişime geçin</a> ya da <a href="https://wa.me/905310149046" target="_blank" rel="noopener noreferrer">WhatsApp</a> üzerinden destek alın.</p>
      </div>
    </div>
  );
};

export default BootcampFAQ;
