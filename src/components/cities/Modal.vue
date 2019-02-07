<template>
  <div
    class="modal fade"
    id="cityModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="cityModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="cityModalLabel">Добавить новый город</h4>
        </div>
        <div class="modal-body">
          <b>Название:</b>
          <input class="form-control" v-model="city.name" placeholder="введите название...">
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
import axios from "axios";
import { mapActions } from "vuex";

const emptyCity = {
  name: ""
};

export default {
  data() {
    return {
      city: { ...emptyCity }
    };
  },
  methods: {
    ...mapActions(["showNotification"]),
    async createCity() {
      try {
        const { data: token } = await axios.get("/site/csrf");
        token.City = {
          name: this.city.name
        };
        const { data: res } = await axios.post("/city/create", token);
        this.$store.dispatch("showNotification", {
          text: res.text ? res.text : "Город успешно добавлен!",
          type: "success"
        });
        this.city = { ...emptyCity };
        $("#cityModal").modal("hide");
        this.$emit("refresh");
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Не удалось добавить город! " +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createCity();
      }
    },
    validate() {
      let result = true;
      if (!this.city.name) {
        this.$store.dispatch("showNotification", {
          text: "Поле «Название» не может быть пустым!",
          type: "error"
        });
        result = false;
      }
      return result;
    }
  }
};
</script>

