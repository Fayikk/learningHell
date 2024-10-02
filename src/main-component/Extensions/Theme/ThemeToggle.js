import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';
const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const { t, i18n } = useTranslation();


  const changeLanguage = (lng) => {
    localStorage.setItem("language", lng);
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };


//   {t("Sign Up")}

  return (
    <button
    onClick={toggleTheme}
    style={{
      padding: '8px 16px', // Daha küçük padding
      margin: '10px', // Daha az margin
      backgroundColor: 'var(--primary-color)',
      color: 'var(--text-color)',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.3s, transform 0.3s',
      fontSize: '14px', // Daha küçük font boyutu
      fontWeight: 'bold',
      minWidth: '120px', // Minimum genişlik
      maxWidth: '200px', // Maksimum genişlik
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    }}
  >
    {theme === 'light' ? t("Karanlık Moda Geç") : t("Aydınlık Moda Geç")}
  </button>
  
  
  );
};

export default ThemeToggle;
