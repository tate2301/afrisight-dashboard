export const setLocalStorageItem = (name: string, data: any) => {
  localStorage.setItem(
    name,
    typeof data === 'object' ? JSON.stringify(data) : data
  );
};

export const getFromLocalStorage = (key: string) => {
  //   const storedValue: any = localStorage.getItem(key);
  //   return JSON.parse(storedValue);
  const initialValue = null;

  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    return initialValue;
  }
};
