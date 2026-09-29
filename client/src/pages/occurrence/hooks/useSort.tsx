import { type IOccurrence } from '@/types/Occurrence';
import { useMemo, useState } from 'react';
import { sortByAlphabet, sortByCategory, sortByDate } from '../helpers/sort';

enum SortEnum {
  ALPHABET = 'ALPHABET',
  CATEGORY = 'CATEGORY',
  DEFAULT = 'DEFAULT',
  DATE = 'DATE',
}

const useSort = ({ occurrences }: { occurrences: IOccurrence[] }) => {
  const [sort, setSort] = useState<SortEnum>(SortEnum.DEFAULT);

  const occsSorted = useMemo(() => {
    let occs = occurrences;

    if (sort === SortEnum.ALPHABET) occs = sortByAlphabet(occurrences);
    if (sort === SortEnum.CATEGORY) occs = sortByCategory(occurrences);
    if (sort === SortEnum.DATE) occs = sortByDate(occurrences);

    return occs;
  }, [sort, occurrences]);

  const SortList = () => {
    return (
      <ul>
        <li
          onClick={() => setSort(SortEnum.DEFAULT)}
          data-sort-active={sort === SortEnum.DEFAULT}
        >
          Creation (default)
        </li>
        <li
          onClick={() => setSort(SortEnum.CATEGORY)}
          data-sort-active={sort === SortEnum.CATEGORY}
        >
          Category
        </li>
        <li
          onClick={() => setSort(SortEnum.ALPHABET)}
          data-sort-active={sort === SortEnum.ALPHABET}
        >
          Alphabet
        </li>
        <li
          onClick={() => setSort(SortEnum.DATE)}
          data-sort-active={sort === SortEnum.DATE}
        >
          Date
        </li>
      </ul>
    );
  };

  return {
    occsSorted,
    sort,
    SortList,
  };
};

export default useSort;
