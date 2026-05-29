import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    background_color: '#ffffff',
    text_color: '#1a1a2e',
    card_color: '#f8f9fa',
    header_text: 'KOYE FACHE PROSPERITY PARTY',
    subtitle_text: 'LIVE ELECTORS COUNT',
    footer_text: 'Developed By Amanuel ICT Solution',
    footer_enabled: 1,
    logo: null,
    counter_color: '#e94560',
    screen_background: '#ffffff',
    header_color: '#e94560',
    header_font_size: '42px',
    header_font_style: 'Arial',
    font_family: 'Arial'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch {
      // Use defaults
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, setSettings, loadSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};
