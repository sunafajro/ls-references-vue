<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  created() {
    this.getMenuLinks();
    this.getNavLinks();
    this.getUserInfo();
  },
  methods: {
    ...mapActions(["getMenuLinks", "getNavLinks", "getUserInfo"])
  }
};
</script>

