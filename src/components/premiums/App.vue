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
        <modal-component v-bind:languages="languages" v-on:refresh="getData"/>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10">
      <breadcrumbs-component type="premiums" v-if="mode === 'bitrix'"/>
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
import axios from "axios";
import { mapActions, mapState } from "vuex";
import Breadcrumbs from "../helpers/Breadcrumbs.vue";
import Info from "../helpers/Info";
import Menu from "../helpers/Menu";
import Modal from "./Modal";
import Navigation from "../helpers/Navigation";
import Table from "../helpers/Table";

const defaultActions = {
  create: false,
  update: false,
  delete: false
};

export default {
  components: {
    "breadcrumbs-component": Breadcrumbs,
    "info-component": Info,
    "menu-component": Menu,
    "modal-component": Modal,
    "nav-component": Navigation,
    "table-component": Table
  },
  computed: {
    ...mapState(["mode"])
  },
  created() {
    this.getLanguages();
    this.getData();
  },
  data() {
    return {
      actions: { ...defaultActions },
      columns: [],
      data: [],
      languages: []
    };
  },
  methods: {
    ...mapActions(["showNotification"]),
    async getLanguages() {
      try {
        const { data } = await axios.get("/language/index");
        if (data.hasOwnProperty("data") && data.data.length > 0) {
          this.languages = data.data;
        }
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Ошибка загрузки списка языков!" +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    async getData() {
      try {
        const { data } = await axios.get("/language-premium/index");
        if (data.hasOwnProperty("columns") && data.columns.length > 0) {
          this.columns = data.columns;
        }
        if (data.hasOwnProperty("data") && data.data.length > 0) {
          this.data = data.data;
        }
        if (
          data.hasOwnProperty("actions") &&
          Object.keys(data.actions).length
        ) {
          this.actions = data.actions;
        }
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Ошибка загрузки справочника языковых надбавок!" +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    async handleDelete(id) {
      try {
        const { data: token } = await axios.get("/site/csrf");
        const { data: res } = await axios.post(
          "/language-premium/delete?id=" + id,
          token
        );
        this.$store.dispatch("showNotification", {
          text: res.text ? res.text : "Языковая надбавка успешно удалена!",
          type: "success"
        });
        await this.getData();
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Не удалось удалить языковую надбавку!" +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    handleCreate() {
      $("#premiumModal").modal("show");
    }
  }
};
</script>
