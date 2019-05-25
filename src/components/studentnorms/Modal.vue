<template>
  <div
    class="modal fade"
    id="studnormModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="studnormModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="studnormModalLabel">Добавить новую норму оплаты</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Название:</b>
            <input class="form-control" v-model="studnorm.name" placeholder="введите название...">
          </div>
          <div class="from-group">
            <b>Значение:</b>
            <input class="form-control" v-model="studnorm.value" placeholder="введите значение...">
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

const emptyStudnorm = {
  name: '',
  value: '',
};

export default {
  computed: {
    ...mapState(['csrfToken']),
  },
  data() {
    return {
      studnorm: { ...emptyStudnorm },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createStudnorm() {
      try {
        let value =
          typeof this.studnorm.value === 'string'
            ? this.studnorm.value
            : String(this.studnorm.value);
        value = value.replace(/,/g, '.');
        const body = Object.assign({}, this.csrfToken, {
          Studnorm: {
            name: this.studnorm.name,
            value,
          },
        });
        const { data: res } = await axios.post('/studnorm/create', body);
        this.$store.dispatch('showNotification', {
          text: res.text
            ? res.text
            : 'Норма оплаты студента успешно добавлена!',
          type: 'success',
        });
        this.studnorm = { ...emptyStudnorm };
        $('#studnormModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить норму оплаты студента! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createStudnorm();
      }
    },
    validate() {
      let result = true;
      if (!this.studnorm.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.studnorm.value) {
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
