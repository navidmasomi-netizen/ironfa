import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen.jsx";
import GymApp from "./components/GymApp.jsx";
import { getSession, saveSession, clearSession, normalizePersistedUser } from "./utils/storage.js";
import { getInitialLanguage, saveLanguage } from "./utils/translations.js";

export default function App() {
  const [user, setUser] = useState(() => normalizePersistedUser(getSession()));
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  if (!user) {
    return (
      <AuthScreen
        onLogin={setUser}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <GymApp
      user={user}
      onLogout={() => { clearSession(); setUser(null); }}
      language={language}
      setLanguage={setLanguage}
    />
  );
}
