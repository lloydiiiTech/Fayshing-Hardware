// src/store/auth.js
import axios from 'axios';

const state = {
  user: null,
  token: localStorage.getItem('token') || '',
  isAuthenticated: !!localStorage.getItem('token'),
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
};

const actions = {
  async register({ dispatch }, formData) {
    try {
      const response = await axios.post('/auth/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error("Registration error:", error.response.data.message);
    }
  },

  async login({ commit }, credentials) {
    try {
      const response = await axios.post('/auth/login', credentials);
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      commit('setToken', token);
      commit('setUser', response.data.user);
    } catch (error) {
      console.error("Login error:", error.response.data.message);
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await axios.get('/auth/user');
      commit('setUser', response.data.user);
    } catch (error) {
      console.error("Fetch user error:", error.response.data.message);
    }
  },

  logout({ commit }) {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    commit('setToken', '');
    commit('setUser', null);
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    state.isAuthenticated = !!token;
  },
  setUser(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
