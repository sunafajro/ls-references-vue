<template>
  <div
    class="modal fade"
    id="officeModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="officeModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="officeModalLabel">Добавить новый офис</h4>
        </div>
        <div class="modal-body">
          <b>Название:</b>
          <input class="form-control" v-model="office.name" placeholder="введите название...">
          <b>Город:</b>
          <select class="form-control" v-model="office.city">
            <option value="-select-" disabled>-выберите город-</option>
            <option
              v-for="city in cities"
              v-bind:key="city.id"
              v-bind:value="city.id"
            >{{ city.name }}</option>
          </select>
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

const emptyOffice = {
  city: '-select-',
  name: '',
};

export default {
  computed: {
    ...mapState(['csrfToken', 'urls']),
  },
  data() {
    return {
      office: { ...emptyOffice },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createOffice() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          Office: {
            name: this.office.name,
            calc_city: this.office.city,
            num: 0,
          },
        });
        const { data: res } = await axios.post(this.urls.createItem.replace('{name}', this.$route.name), body);
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Офис успешно добавлен!',
          type: 'success',
        });
        this.office = { ...emptyOffice };
        $('#officeModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить офис! ' + (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createOffice();
      }
    },
    validate() {
      let result = true;
      if (!this.office.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (
        !this.office.city ||
        (this.office.city && this.office.city === '-select-')
      ) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Город» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      return result;
    },
  },
  props: {
    cities: {
      type: Array,
      require: true,
    },
  },
};
</script>
