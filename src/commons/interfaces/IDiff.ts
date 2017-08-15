export interface IDiff<T> {
  NEW: T[];
  UPDATED: {
    old: T[],
    new: T[]
  };
  DELETED: T[];
};
