<template>
  <div
    class="modal fade"
    id="timenormModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="timenormModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="timenormModalLabel">Добавить новую норму времени</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Название:</b>
            <input class="form-control" v-model="timenorm.name" placeholder="введите название...">
          </div>
          <div class="from-group">
            <b>Значение:</b>
            <input class="form-control" v-model="timenorm.value" placeholder="введите значение...">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" v-on:click="handleSend">Ок</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

const emptyTimenorm = {
  name: '',
  value: '',
};

export default {
  computed: {
    ...mapState(['csrfToken', 'urls']),
  },
  data() {
    return {
      timenorm: { ...emptyTimenorm },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createTimenorm() {
      try {
        let value =
          typeof this.timenorm.value === 'string'
            ? this.timenorm.value
            : String(this.timenorm.value);
        value = value.replace(/,/g, '.');
        const body = Object.assign({}, this.csrfToken, {
          Timenorm: {
            name: this.timenorm.name,
            value,
          },
        });
        const { data: res } = await axios.post(this.urls.createItem.replace('{name}', this.$route.name), body);
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Норма времени успешно добавлена!',
          type: 'success',
        });
        this.timenorm = { ...emptyTimenorm };
        $('#timenormModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить норму времени! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createTimenorm();
      }
    },
    validate() {
      let result = true;
      if (!this.timenorm.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.timenorm.value) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Значение» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
};
</script>