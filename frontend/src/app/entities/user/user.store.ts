import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>(initialState),
  withMethods((store) => ({
    setUser(user: User | null) {
      patchState(store, { user, isLoggedIn: !!user });
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      patchState(store, { user: null, isLoggedIn: false });
    }
  }))
);
