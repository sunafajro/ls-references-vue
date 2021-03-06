<template>
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <nav-component v-if="mode === 'bitrix'"/>
      <info-component/>
      <menu-component title="Справочники"></menu-component>
      <div v-if="actions.create">
        <h4>Действия:</h4>
        <button class="btn btn-success btn-sm btn-block" v-on:click="handleCreate">
          <span class="fa fa-plus" aria-hidden="true"></span> Добавить
        </button>
        <modal-component v-on:refresh="getData"/>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
      <breadcrumbs-component type="teachernorms" v-if="mode === 'bitrix'"/>
      <table-component
        v-bind:actions="actions"
        v-bind:columns="columns"
        v-bind:data="data"
        v-on:row-delete="handleDelete"
      />
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from 'axios';
import { mapActions, mapState } from 'vuex';
import Breadcrumbs from '../helpers/Breadcrumbs.vue';
import Info from '../helpers/Info';
import Menu from '../helpers/Menu';
import Modal from './Modal';
import Navigation from '../helpers/Navigation';
import Table from '../helpers/Table';

const defaultActions = {
  create: false,
  update: false,
  delete: false,
};

export default {
  components: {
    'breadcrumbs-component': Breadcrumbs,
    'info-component': Info,
    'menu-component': Menu,
    'modal-component': Modal,
    'nav-component': Navigation,
    'table-component': Table,
  },
  computed: {
    ...mapState(['csrfToken', 'mode', 'urls']),
  },
  created() {
    this.getData();
  },
  data() {
    return {
      actions: { ...defaultActions },
      columns: [],
      data: [],
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async getData() {
      try {
        const { data } = await axios.get(this.urls.listItems.replace('{name}', this.$route.name));
        if (Object.prototype.hasOwnProperty.call(data, 'columns') && data.columns.length > 0) {
          this.columns = data.columns;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'data') && data.data.length > 0) {
          this.data = data.data;
        }
        if (
          Object.prototype.hasOwnProperty.call(data, 'actions') &&
          Object.keys(data.actions).length
        ) {
          this.actions = data.actions;
        }
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Ошибка загрузки справочника норма оплаты преподавателей! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    async handleDelete(id) {
      try {
        const { data: res } = await axios.post(
          this.urls.deleteItem.replace('{name}', this.$route.name) + '/' + id,
          this.csrfToken
        );
        this.$store.dispatch('showNotification', {
          text: res.text
            ? res.text
            : 'Норма оплаты преподавателя успешно удалена!',
          type: 'success',
        });
        await this.getData();
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось удалить норму оплаты преподавателя! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleCreate() {
      $('#teachernormModal').modal('show');
    },
  },
};
</script>
