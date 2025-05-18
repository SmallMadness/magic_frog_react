import { useState, useCallback, useMemo } from 'react';

/**
 * Custom Hook für Filterlogik
 * @param {Array} initialItems - Die zu filternden Elemente
 * @returns {Object} Filter-Funktionen und -Zustände
 */
const useFilters = (initialItems = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    rarity: '',
    set: '',
    manaCost: '',
    color: ''
  });

  // Handler für Änderungen am Suchbegriff
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Handler für Änderungen an den Filtern
  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === 'reset') {
      setFilters({
        type: '',
        rarity: '',
        set: '',
        manaCost: '',
        color: ''
      });
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: value
      }));
    }
  }, []);

  // Gefilterte Elemente basierend auf Suchbegriff und Filtern
  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      // Suche nach Suchbegriff
      const matchesSearch = !searchTerm || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Filtern nach Kartentyp
      if (filters.type && !item.type?.toLowerCase().includes(filters.type.toLowerCase())) {
        return false;
      }
      
      // Filtern nach Seltenheit
      if (filters.rarity && item.rarity?.toLowerCase() !== filters.rarity.toLowerCase()) {
        return false;
      }
      
      // Filtern nach Set
      if (filters.set && item.set !== filters.set) {
        return false;
      }
      
      // Filtern nach Manakosten
      if (filters.manaCost) {
        const manaCost = parseInt(filters.manaCost);
        const itemManaCost = item.cmc || 0;
        
        if (filters.manaCost === '6+') {
          if (itemManaCost < 6) return false;
        } else if (itemManaCost !== manaCost) {
          return false;
        }
      }
      
      // Filtern nach Farbe
      if (filters.color && item.colors) {
        if (!item.colors.includes(filters.color)) {
          return false;
        }
      }
      
      return true;
    });
  }, [initialItems, searchTerm, filters]);

  return {
    searchTerm,
    filters,
    filteredItems,
    handleSearchChange,
    handleFilterChange
  };
};

export default useFilters;
