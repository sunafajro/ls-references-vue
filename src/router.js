import Vue from 'vue';
import Router from 'vue-router';
import Contacts from './components/contacts/App';
import Languages from './components/languages/App';
import Studentnorms from './components/studentnorms/App';
import Teachernorms from './components/teachernorms/App';
import Timenorms from './components/timenorms/App';
import Premiums from './components/premiums/App';
import Coefficients from './components/coefficients/App';
import Cities from './components/cities/App';
import Offices from './components/offices/App';
import Rooms from './components/rooms/App';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', name: 'root', redirect: '/contacts' },
    { path: '/index', name: 'home', redirect: '/contacts' },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
    },
    {
      path: '/languages',
      name: 'languages',
      component: Languages,
    },
    {
      path: '/studentnorms',
      name: 'studentnorms',
      component: Studentnorms,
    },
    {
      path: '/teachernorms',
      name: 'teachernorms',
      component: Teachernorms,
    },
    {
      path: '/timenorms',
      name: 'timenorms',
      component: Timenorms,
    },
    { path: '/premiums', name: 'premiums', component: Premiums },
    {
      path: '/coefficients',
      name: 'coefficients',
      component: Coefficients,
    },
    { path: '/cities', name: 'cities', component: Cities },
    { path: '/offices', name: 'offices', component: Offices },
    { path: '/rooms', name: 'rooms', component: Rooms },
  ],
});
