import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { useTranslation } from 'react-i18next';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    localStorage.setItem("language", lng);
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
        color: theme === 'light' ? '#333' : '#f0f0f0',
        border: 'none',
        borderRadius: '50%',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s, transform 0.3s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      }}
      aria-label={theme === 'light' ? t("Karanlık Moda Geç") : t("Aydınlık Moda Geç")}
    >
      {theme === 'light' ? (
        <FaMoon size={20} title={t("Karanlık Moda Geç")} />
      ) : (
        <FaSun size={20} title={t("Aydınlık Moda Geç")} />
      )}
    </button>
  );
};

export default ThemeToggle;
