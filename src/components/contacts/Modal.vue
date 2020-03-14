<template>
  <div
    class="modal fade"
    id="contactModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="contactModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="contactModalLabel">Добавить новый контакт</h4>
        </div>
        <div class="modal-body">
          <b>Название:</b>
          <input class="form-control" v-model="contact.name" placeholder="введите название...">
          <b>Телефон:</b>
          <input class="form-control" v-model="contact.phone" placeholder="введите телефон...">
          <b>Описание:</b>
          <input
            class="form-control"
            v-model="contact.description"
            placeholder="введите описание..."
          >
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

const emptyContact = {
  name: '',
  phone: '',
  description: '',
};

export default {
  computed: {
    ...mapState(['csrfToken', 'urls']),
  },
  data() {
    return {
      contact: { ...emptyContact },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createContact() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          Phonebook: {
            name: this.contact.name,
            phonenumber: this.contact.phone,
            description: this.contact.description,
          },
        });
        const { data: res } = await axios.post(this.urls.createItem.replace('{name}', this.$route.name), body);
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Номер телефона успешно добавлен!',
          type: 'success',
        });
        this.contact = { ...emptyContact };
        $('#contactModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить номер телефона! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createContact();
      }
    },
    validate() {
      let result = true;
      if (!this.contact.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.contact.phone) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Телефон» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.contact.description) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Описание» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
};
</script>