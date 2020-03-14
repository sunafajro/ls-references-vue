<template>
  <div
    class="modal fade"
    id="roomModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="roomModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="roomModalLabel">Добавить новый кабинет</h4>
        </div>
        <div class="modal-body">
          <b>Название:</b>
          <input class="form-control" v-model="room.name" placeholder="введите название...">
          <b>Офис:</b>
          <select class="form-control" v-model="room.office">
            <option value="-select-" disabled>-выберите офис-</option>
            <option
              v-for="office in offices"
              v-bind:key="office.id"
              v-bind:value="office.id"
            >{{ office.name }}</option>
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

const emptyRoom = {
  name: '',
  office: '-select-',
};

export default {
  computed: {
    ...mapState(['csrfToken', 'urls']),
  },
  data() {
    return {
      room: { ...emptyRoom },
    };
  },
  methods: {
    ...mapActions(['showNotification']),
    async createRoom() {
      try {
        const body = Object.assign({}, this.csrfToken, {
          Room: {
            name: this.room.name,
            calc_office: this.room.office,
          },
        });
        const { data: res } = await axios.post(this.urls.createItem.replace('{name}', this.$route.name), body);
        this.$store.dispatch('showNotification', {
          text: res.text ? res.text : 'Кабинет успешно добавлен!',
          type: 'success',
        });
        this.room = { ...emptyRoom };
        $('#roomModal').modal('hide');
        this.$emit('refresh');
      } catch (e) {
        this.$store.dispatch('showNotification', {
          text:
            'Не удалось добавить кабинет! ' + (e && e.message ? e.message : ''),
          type: 'error',
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createRoom();
      }
    },
    validate() {
      let result = true;
      if (!this.room.name) {
        this.$store.dispatch('showNotification', {
          text: 'Поле «Название» не может быть пустым!',
          type: 'error',
        });
        result = false;
      }
      if (
        !this.room.office ||
        (this.room.office && this.room.office === '-select-')
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
    offices: {
      type: Array,
      require: true,
    },
  },
};
</script>
