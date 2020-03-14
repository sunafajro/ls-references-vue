<template>
  <div
    class="modal fade"
    id="volonteerModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="volonteerModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="volonteerModalLabel">
            Добавить нового волонтера
          </h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>ФИО:</b>
            <input
              class="form-control"
              v-model="volonteer.name"
              placeholder="введите ФИО..."
            />
          </div>
          <div class="from-group">
            <b>Дата рождения:</b>
            <input
              class="form-control"
              v-model="volonteer.birthdate"
              placeholder="введите дату рождения..."
            />
          </div>
          <div class="from-group">
            <b>Город:</b>
            <input
              class="form-control"
              v-model="volonteer.city"
              placeholder="введите город..."
            />
          </div>
          <div class="from-group">
            <b>Род занятий (номер и название учебного заведения):</b>
            <input
              class="form-control"
              v-model="volonteer.occupation"
              placeholder="введите род занятий..."
            />
          </div>
          <div class="from-group">
            <b>Вожатый/помощник:</b>
            <input
              class="form-control"
              v-model="volonteer.type"
              placeholder="введите тип..."
            />
          </div>
          <div class="from-group">
            <b>Контакт в соцсетях:</b>
            <input
              class="form-control"
              v-model="volonteer.social"
              placeholder="введите ссылку на соцсеть..."
            />
          </div>
          <div class="from-group">
            <b>Телефон:</b>
            <input
              class="form-control"
              v-model="volonteer.phone"
              placeholder="введите телефон..."
            />
          </div>
          <div class="from-group">
            <b>Примечание:</b>
            <input
              class="form-control"
              v-model="volonteer.note"
              placeholder="введите примечание..."
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" v-on:click="handleSend">
            Ок
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from 'axios';
import { mapActions, mapState } from 'vuex';

const emptyVolonteer = {
  name: '',
  birthdate: '',
  city: '',
  occupation: '',
  type: '',
  social: '',
  phone: '',
  note: '',
};

export default {
  computed: {
    ...mapState(['csrfToken', 'urls']),
  },
  data() {
    return {
      volonteer: { ...emptyVolonteer },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createVolonteer() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          Volonteer: {
            name: this.volonteer.name,
            birthdate: this.volonteer.birthdate,
            city: this.volonteer.city,
            occupation: this.volonteer.occupation,
            type: this.volonteer.type,
            social: this.volonteer.social,
            phone: this.volonteer.phone,
            note: this.volonteer.note,
          },
        });
        const { data: res } = await axios.post(
          this.urls.createItem.replace('{name}', this.$route.name),
          body
        );
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Волонтер успешно добавлен!',
          type: 'success',
        });
        this.volonteer = { ...emptyVolonteer };
        $('#volonteerModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить волонтера! ' +
            (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createVolonteer();
      }
    },
    validate() {
      let result = true;
      if (!this.volonteer.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «ФИО» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (!this.volonteer.phone) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Телефон» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
};
</script>
