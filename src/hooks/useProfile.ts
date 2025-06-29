import { useState, useEffect } from 'react';

interface ProfileSettings {
  colorPrimary: string;
  siderMenuType: 'sub' | 'group';
  layout: 'top' | 'mix' | 'side';
  theme?: 'light' | 'realDark';
}

const DEFAULT_SETTINGS: ProfileSettings = {
  colorPrimary: "#FA541C",
  siderMenuType: "sub",
  layout: "top",
  theme: "realDark"
};

const useProfile = () => {
  const [profile, setProfile] = useState<any>(DEFAULT_SETTINGS);

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile({ ...DEFAULT_SETTINGS, ...parsedProfile });
      } catch (error) {
        console.error("Error parsing profile:", error);
        setProfile(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateProfile = (newSettings: Partial<ProfileSettings>) => {
    const updatedProfile = { ...profile, ...newSettings };
    setProfile(updatedProfile);
    localStorage.setItem("profile", JSON.stringify(updatedProfile));
  };

  return { profile, updateProfile };
};

export default useProfile;
