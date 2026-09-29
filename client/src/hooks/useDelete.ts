import { useState } from 'react';

const useDelete = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const onSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const onDeselect = (id: string) => {
    setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  return {
    onSelect,
    onDeselect,
    selectedIds,
    selectedCount: selectedIds.length,
    clearSelection: () => setSelectedIds([]),
  };
};

export default useDelete;
