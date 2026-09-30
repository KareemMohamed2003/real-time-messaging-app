'use client';
import { useState, useMemo } from 'react';
export default function useSearch(list: any[], filterParam: any) {
  const [search, setSearch] = useState('');
  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(c => c[filterParam].toLowerCase().includes(q));
  }, [list, search]);
  return { filteredList, search, setSearch };
}
