import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { RootState, AuthState } from '@/store/types';

export const state: AuthState = {
  isAdmin: false,
  isKeyManager: false,
  tokens: {
    access: null,
    expires: null,
    refresh: null,
  },
};

const namespaced: boolean = true;

export const auth: Module<AuthState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
