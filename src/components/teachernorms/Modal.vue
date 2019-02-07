<template>
  <div
    class="modal fade"
    id="teachernormModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="teachernormModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="teachernormModalLabel">Добавить новую норму оплаты</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Название:</b>
            <input
              class="form-control"
              v-model="teachernorm.name"
              placeholder="введите название..."
            >
          </div>
          <div class="from-group">
            <b>Значение:</b>
            <input
              class="form-control"
              v-model="teachernorm.value"
              placeholder="введите значение..."
            >
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
import axios from "axios";
import { mapActions } from "vuex";

const emptyTeachernorm = {
  name: "",
  value: ""
};

export default {
  data() {
    return {
      teachernorm: { ...emptyTeachernorm }
    };
  },
  methods: {
    ...mapActions(["showNotification"]),
    async createTeachernorm() {
      try {
        const { data: token } = await axios.get("/site/csrf");
        let value =
          typeof this.teachernorm.value === "string"
            ? this.teachernorm.value
            : String(this.teachernorm.value);
        value = value.replace(/,/g, ".");
        token.Edunorm = {
          name: this.teachernorm.name,
          value
        };
        const { data: res } = await axios.post("/edunorm/create", token);
        this.$store.dispatch("showNotification", {
          text: res.text
            ? res.text
            : "Норма оплаты преподавателя успешно добавлена!",
          type: "success"
        });
        this.studnorm = { ...emptyTeachernorm };
        $("#teachernormModal").modal("hide");
        this.$emit("refresh");
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Не удалось добавить норму оплаты преподавателя! " +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createTeachernorm();
      }
    },
    validate() {
      let result = true;
      if (!this.teachernorm.name) {
        this.$store.dispatch("showNotification", {
          text: "Поле «Название» не может быть пустым!",
          type: "error"
        });
        result = false;
      }
      if (!this.teachernorm.value) {
        this.$store.dispatch("showNotification", {
          text: "Поле «Значение» не может быть пустым!",
          type: "error"
        });
        result = false;
      }
      return result;
    }
  }
};
</script>
