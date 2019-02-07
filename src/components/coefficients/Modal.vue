<template>
  <div
    class="modal fade"
    id="coefficientModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="coefficientModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="coefficientModalLabel">Добавить новый коэффициент</h4>
        </div>
        <div class="modal-body">
          <div class="from-group">
            <b>Количество студентов:</b>
            <input
              class="form-control"
              v-model="coefficient.studcount"
              placeholder="введите количество студентов..."
            >
          </div>
          <div class="from-group">
            <b>Коэффициент:</b>
            <input
              class="form-control"
              v-model="coefficient.value"
              placeholder="введите коэффициент..."
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

const emptyCoefficient = {
  studcount: 0,
  value: 1
};

export default {
  data() {
    return {
      coefficient: { ...emptyCoefficient }
    };
  },
  methods: {
    ...mapActions(["showNotification"]),
    async createCoefficient() {
      try {
        const { data: token } = await axios.get("/site/csrf");
        let value =
          typeof this.coefficient.value === "string"
            ? this.coefficient.value
            : String(this.coefficient.value);
        value = value.replace(/,/g, ".");
        token.Coefficient = {
          studcount: this.coefficient.studcount,
          value
        };
        const { data: res } = await axios.post("/coefficient/create", token);
        this.$store.dispatch("showNotification", {
          text: res.text ? res.text : "Коэффициент успешно добавлен!",
          type: "success"
        });
        this.coefficient = { ...emptyCoefficient };
        $("#coefficientModal").modal("hide");
        this.$emit("refresh");
      } catch (e) {
        this.$store.dispatch("showNotification", {
          text:
            "Не удалось добавить коэффициент! " +
            (e && e.message ? e.message : ""),
          type: "error"
        });
      }
    },
    handleSend() {
      if (this.validate()) {
        this.createCoefficient();
      }
    },
    validate() {
      let result = true;
      const studcount = parseInt(this.coefficient.studcount, 10);
      if (isNaN(studcount) || studcount === 0) {
        this.$store.dispatch("showNotification", {
          text: "Поле «Количество студентов» не может быть пустым или нулем!",
          type: "error"
        });
        result = false;
      }
      const value = parseInt(this.coefficient.value, 10);
      if (isNaN(value) || value < 1) {
        this.$store.dispatch("showNotification", {
          text: "Поле «Коэффициент» не может быть пустым или нулем!",
          type: "error"
        });
        result = false;
      }
      return result;
    }
  }
};
</script>

