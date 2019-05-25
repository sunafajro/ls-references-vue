<template>
  <div
    class="modal fade"
    id="languageModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="languageModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="languageModalLabel">Добавить новый язык</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Название:</b>
            <input class="form-control" v-model="language.name" placeholder="введите название...">
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

const emptyLanguage = {
  name: '',
};

export default {
  computed: {
    ...mapState(['csrfToken']),
  },
  data() {
    return {
      language: { ...emptyLanguage },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createLanguage() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          Language: {
            name: this.language.name,
          },
        });
        const { data: res } = await axios.post('/language/create', body);
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Язык успешно добавлен!',
          type: 'success',
        });
        this.city = { ...emptyLanguage };
        $('#languageModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text: 'Не удалось добавить язык! ' + (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createLanguage();
      }
    },
    validate() {
      let result = true;
      if (!this.language.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
};
</script>
