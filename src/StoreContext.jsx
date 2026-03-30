import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULE_DATABASE, AREA_LIMITS } from './data';

const StoreContext = createContext();

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  const [specialization, setSpecialization] = useState(() => {
    return localStorage.getItem('nr_specialization') || null;
  });

  const [hasOnboarded, setHasOnboarded] = useState(() => {
    const saved = localStorage.getItem('nr_has_onboarded');
    if (saved !== null) return saved === 'true';
    return localStorage.getItem('nr_specialization') !== null || !!localStorage.getItem('nr_selectedModules');
  });

  const [selectedModules, setSelectedModules] = useState(() => {
    const saved = localStorage.getItem('nr_selectedModules');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (specialization) {
      localStorage.setItem('nr_specialization', specialization);
    } else {
      localStorage.removeItem('nr_specialization');
    }
  }, [specialization]);

  useEffect(() => {
    localStorage.setItem('nr_has_onboarded', hasOnboarded);
  }, [hasOnboarded]);

  useEffect(() => {
    localStorage.setItem('nr_selectedModules', JSON.stringify(selectedModules));
  }, [selectedModules]);

  const resetSpecialization = () => {
    setSelectedModules(prev => prev.filter(m => m.area !== 'schwerpunkt'));
    setSpecialization(null);
  };

  useEffect(() => {
    localStorage.setItem('nr_selectedModules', JSON.stringify(selectedModules));
  }, [selectedModules]);

  const addModule = (moduleId, area, grade, date) => {
    const module = MODULE_DATABASE.find(m => m.id === moduleId);
    if (!module) return false;

    const currentModulesInArea = selectedModules.filter(m => m.area === area);
    const currentLp = currentModulesInArea.reduce((sum, m) => {
      const dbModule = MODULE_DATABASE.find(dbm => dbm.id === m.id);
      return sum + (dbModule ? dbModule.lp : 0);
    }, 0);

    if (currentLp + module.lp > AREA_LIMITS[area]) {
      throw new Error(`Limit für ${area} (${AREA_LIMITS[area]} LP) würde überschritten.`);
    }

    const newModule = { id: moduleId, area, grade, date };
    setSelectedModules(prev => [...prev, newModule]);
    return true;
  };

  const removeModule = (moduleId) => {
    setSelectedModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const editModule = (moduleId, newArea, newGrade, newDate) => {
    const dbModule = MODULE_DATABASE.find(m => m.id === moduleId);
    if (!dbModule) throw new Error("Module not found in DB.");

    // Synchrone Berechnung vor der Mutation
    const filtered = selectedModules.filter(m => m.id !== moduleId);
    
    const currentAreaLp = filtered
      .filter(m => m.area === newArea)
      .reduce((sum, m) => {
        const mDb = MODULE_DATABASE.find(db => db.id === m.id);
        return sum + (mDb ? mDb.lp : 0);
      }, 0);

    if (currentAreaLp + dbModule.lp > AREA_LIMITS[newArea]) {
      throw new Error(`ECTS Limit im neuen Bereich überschritten`);
    }

    setSelectedModules([...filtered, { id: moduleId, area: newArea, grade: newGrade, date: newDate }]);
    return true;
  };

  const METHODS_MODULE_IDS = ['am_empirical', 'am_comp', 'am_sel_metrics'];

  const getAvailableModulesForArea = (area, editModuleId = null) => {
    const selectedIds = selectedModules.map(m => m.id);
    
    // Check if a method module is already selected IN THE SCHWERPUNKT
    const selectedMethodInSchwerpunkt = selectedModules.find(
      m => m.area === 'schwerpunkt' && METHODS_MODULE_IDS.includes(m.id)
    );

    return MODULE_DATABASE.filter(m => {
      const inArea = m.areas.includes(area);
      // Bypass: Wenn das Modul gerade editiert wird, MUSS es in der Liste bleiben
      const notSelected = !selectedIds.includes(m.id) || m.id === editModuleId;

      // XOR Logic for Schwerpunkt Methods
      let isMethodAllowed = true;
      if (area === 'schwerpunkt' && METHODS_MODULE_IDS.includes(m.id)) {
        // Only restrict if a different method module is already selected
        if (selectedMethodInSchwerpunkt && selectedMethodInSchwerpunkt.id !== m.id && m.id !== editModuleId) {
           isMethodAllowed = false;
        }
      }

      // Strikte Null-Safety für das specializations-Array (?.)
      if (area === 'schwerpunkt' && specialization && specialization !== 'skipped') {
        const matchesSpec = m.specializations?.includes(specialization) || false;
        return inArea && notSelected && matchesSpec && isMethodAllowed;
      }
      
      return inArea && notSelected && isMethodAllowed;
    });
  };

  const isAreaLocked = (area) => {
    const currentModulesInArea = selectedModules.filter(m => m.area === area);
    const currentLp = currentModulesInArea.reduce((sum, m) => {
      const dbModule = MODULE_DATABASE.find(dbm => dbm.id === m.id);
      return sum + (dbModule ? dbModule.lp : 0);
    }, 0);

    return currentLp === AREA_LIMITS[area];
  };

  const value = {
    hasOnboarded,
    setHasOnboarded,
    specialization,
    setSpecialization,
    resetSpecialization,
    selectedModules,
    setSelectedModules, // Exposed for Backup
    addModule,
    removeModule,
    editModule, // New mutation
    getAvailableModulesForArea,
    isAreaLocked
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
