import { type IOccurrence } from '@/types/Occurrence';

export function sortByAlphabet(occs: IOccurrence[]) {
  return occs.sort((a, b) => {
    const x = a.title.toLowerCase();
    const y = b.title.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
}

export function sortByCategory(occs: IOccurrence[]) {
  return occs.sort((a, b) => {
    return a.category.localeCompare(b.category);
  });
}

export function sortByDate(occs: IOccurrence[]) {
  return occs.sort((a, b) => {
    const x = new Date(a.dateOfOccurrence);
    const y = new Date(b.dateOfOccurrence);
    return x.getTime() - y.getTime();
  });
}
