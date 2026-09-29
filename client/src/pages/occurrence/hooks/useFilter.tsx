import { useState } from 'react';
import { OccurrenceCategoryEnum } from '../enum/OccurrenceCategoryEnum';

const useFilter = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const FilterList = () => {
    return (
      <>
        <span>Category</span>
        <ul>
          {['All', ...Object.values(OccurrenceCategoryEnum)].map((occ) => (
            <li
              key={occ}
              onClick={() => setActiveCategory(occ)}
              data-category-active={activeCategory === occ}
            >
              {occ}
            </li>
          ))}{' '}
        </ul>
      </>
    );
  };

  return {
    activeCategory,
    FilterList,
    handleActiveCategory: setActiveCategory,
  };
};

export default useFilter;
