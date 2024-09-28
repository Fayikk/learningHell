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
    <button onClick={toggleTheme} style={{
      padding: '10px 20px',
      margin: '20px',
      backgroundColor: 'var(--primary-color)',
      color: 'var(--text-color)',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer'
    }}>
      {theme === 'light' ? <>{t("Karanlık Moda Geç")} </>: <>{t("Aydınlık Moda Geç")} </>}
    </button>
  );
};

export default ThemeToggle;
