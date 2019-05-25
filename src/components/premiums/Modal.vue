<template>
  <div
    class="modal fade"
    id="premiumModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="premiumModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="premiumModalLabel">Добавить новую надбавку</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Язык:</b>
            <select class="form-control" v-model="premium.language">
              <option value="-select-" disabled>-выберите язык-</option>
              <option
                v-for="language in languages"
                v-bind:key="language.id"
                v-bind:value="language.id"
              >{{ language.name }}</option>
            </select>
          </div>
          <div class="from-group">
            <b>Значение:</b>
            <input class="form-control" v-model="premium.value" placeholder="введите значение...">
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

const emptyPremium = {
  language: '-select-',
  value: '',
};

export default {
  computed: {
    ...mapState(['csrfToken']),
  },
  data: function() {
    return {
      premium: { ...emptyPremium },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createPremium() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          LanguagePremium: {
            language_id: this.premium.language,
            value: this.premium.value,
          },
        });
        const { data: res } = await axios.post(
          '/language-premium/create',
          body
        );
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Языковая надбавка успешно добавлен!',
          type: 'success',
        });
        this.premium = { ...emptyPremium };
        $('#premiumModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить языковую надбавку! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createPremium();
      }
    },
    validate() {
      let result = true;
      if (
        !this.premium.language ||
        (this.premium.language && this.premium.language === '-select-')
      ) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Язык» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.premium.value) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Значение» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
  props: {
    languages: {
      type: Array,
      require: true,
    },
  },
};
</script>
