import Vue from 'vue';
import Vuex from 'vuex';
import Noty from 'noty';
import axios from 'axios';

Vue.use(Vuex);
const el = document.getElementById('app');

export default new Vuex.Store({
  state: {
    breadcrumbs: {},
    links: [],
    navLinks: [],
    mode: el.dataset.mode,
    user: {},
  },
  mutations: {
    updateLinks(state, data) {
      state.links = data;
      state.breadcrumbs = data.reduce((a, v) => {
        const key = v.url.slice(1);
        a[v.url.slice(1)] = [
          {
            id: 'home',
            style: null,
            text: 'Главная',
            url: '/',
          },
          {
            id: 'references',
            style: null,
            text: 'Справочники',
            url: '/index',
          },
          {
            id: key,
            style: 'active',
            text: v.name,
            url: null,
          },
        ];
        return a;
      }, {});
    },
    updateNavLinks(state, data) {
      state.navLinks = data;
    },
    updateUser(state, data) {
      state.user = data;
    },
  },
  actions: {
    async getMenuLinks({ commit, dispatch }) {
      try {
        const { data } = await axios.get('/reference/menu-links');
        commit('updateLinks', data.links);
      } catch (e) {
        dispatch('showNotification', {
          text:
            'Ошибка загрузки элементов меню справочников! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    async getNavLinks({ commit, dispatch }) {
      try {
        const { data: token } = await axios.get('/site/csrf');
        const { data: nav } = await axios.post(
          '/site/nav',
          Object.assign({}, token, { type: 'all' })
        );
        commit('updateNavLinks', nav.navElements);
      } catch (e) {
        dispatch('showNotification', {
          text:
            'Ошибка загрузки элементов меню навигации! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    async getUserInfo({ commit, dispatch }) {
      try {
        const { data } = await axios.get('/user/get-info');
        commit('updateUser', data.userData);
      } catch (e) {
        dispatch('showNotification', {
          text:
            'Ошибка загрузки информации о пользователе! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    showNotification(args, payload) {
      new Noty({
        theme: 'bootstrap-v4',
        text: payload.text,
        timeout: 3000,
        type: payload.type,
      }).show();
    },
  },
});
