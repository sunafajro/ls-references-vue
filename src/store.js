import Vue from 'vue';
import Vuex from 'vuex';
import Noty from 'noty';
import axios from 'axios';

Vue.use(Vuex);
const el = document.getElementById('app');

export default new Vuex.Store({
  state: {
    breadcrumbs: {},
    csrfToken: null,
    links: [],
    navLinks: [],
    mode: el.dataset.mode,
    urls: JSON.parse(el.dataset.urls),
    user: {},
  },
  mutations: {
    updateCSRFToken(state, token) {
      state.csrfToken = token;
    },
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
    /**
     * csrf токен для валидации post запросов
     */
    async getCSRFToken({ commit, dispatch, state }) {
      try {
        const { data } = await axios.get(state.urls.csrf);
        commit('updateCSRFToken', data);
      } catch (e) {
        dispatch('showNotification', {
          text:
            'Ошибка запроса к серверу!' +
            (e && e.message ? ' ' + e.message : ''),
          type: 'error',
        });
        throw new Error('Ошибка запроса к серверу!');
      }
    },
    async getMenuLinks({ commit, dispatch, state }) {
      try {
        const { data } = await axios.get(state.urls.menuLinks);
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
    async getNavLinks({ commit, dispatch, state }) {
      try {
        const { data: nav } = await axios.post(
          state.urls.navLinks,
          Object.assign({}, state.csrfToken, { type: 'all' })
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
    async getUserInfo({ commit, dispatch, state }) {
      try {
        const { data } = await axios.get(state.urls.userInfo);
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
