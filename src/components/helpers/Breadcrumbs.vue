<template>
  <ul class="breadcrumb">
    <li :class="link.style" :key="'ul-' + link.id" v-for="link in links">
      <router-link :to="link.url" v-if="link.url">{{ link.text }}</router-link>
      <span v-if="!link.url">{{ link.text }}</span>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    type: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapState(["breadcrumbs"]),
    links() {
      return this.breadcrumbs[this.type];
    }
  }
};
</script>
