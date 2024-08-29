import { createContext, useReducer, ReactNode, Dispatch } from 'react';
import {
  getFromLocalStorage,
  setLocalStorageItem,
} from '../helpers/locaStorageMethods';
import { UserInfoTypes } from '../utils/types';

interface State {
  darkMode: boolean;
  access_token: string | null;
  refresh_token: string | null;
  search_query: string;

  userInfo?: UserInfoTypes | null;
}

// Define the types for actions
type Action =
  | { type: 'DARK_MODE_ON' }
  | { type: 'DARK_MODE_OFF' }
  | { type: 'USER_LOGIN'; payload: any }
  | { type: 'USER_LOGOUT' }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

// Define the type for the context value
interface ContextProps {
  state: State;
  dispatch: Dispatch<Action>;
}

// Initial state
const initialState: State = {
  darkMode: false,
  access_token: getFromLocalStorage('access_token'),
  refresh_token: getFromLocalStorage('refresh_token'),
  search_query: '',

  userInfo: null,
};

// Create context
export const Store = createContext<ContextProps | undefined>(undefined);

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };

    case 'USER_LOGIN':
      setLocalStorageItem('access_token', action.payload.access_token);
      setLocalStorageItem('refresh_token', action.payload.refresh_token);
      setLocalStorageItem('userInfo', action.payload.userInfo);
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      setLocalStorageItem('access_token', null);
      setLocalStorageItem('userInfo', null);
      setLocalStorageItem('refresh_token', null);
      return { ...state, userInfo: null };
    case 'SET_SEARCH_QUERY':
      return { ...state, search_query: action.payload };
    default:
      return state;
  }
}

// Define Props for the provider component
interface Props {
  children: ReactNode;
}

// StoreProvider component
export function StoreProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
