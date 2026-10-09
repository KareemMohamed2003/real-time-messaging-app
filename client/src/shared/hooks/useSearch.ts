'use client';
import { useState, useMemo } from 'react';

/**
 * A custom React hook to filter an array of objects based on a specific property and a search query.
 * 
 * @example
 * const { filteredList, search, setSearch } = useSearch(users, 'name');
 * 
 * @param {Object[]} list - The source array of objects to filter.
 * @param {string} filterParam - The key/property name inside the objects to search against.
 * @returns {Object} An object containing the filtered array and the state management for the search query.
 * @returns {Object[]} return.filteredList - The memoized, filtered subset of the original list.
 * @returns {string} return.search - The current search query string.
 * @returns {function(string): void} return.setSearch - State setter function to update the search query.
 */

export default function useSearch(list: any[], filterParam: any) {
  const [search, setSearch] = useState('');
  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c => c[filterParam].toLowerCase().includes(q));
  }, [list, search]);
  return { filteredList, search, setSearch };
}
