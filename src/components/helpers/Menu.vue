<template>
  <div class="dropdown">
    <button
      id="dropdownMenu"
      class="btn btn-default dropdown-toggle btn-sm btn-block"
      type="button"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="true"
    >
      <span class="fa fa-book" aria-hidden="true"></span>
      {{ title }}
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu">
      <li
        v-for="link in links"
        v-bind:key="link.url"
        v-bind:class="{ 'active': $route.path === link.url ? true : false }"
      >
        <router-link v-bind:to="link.url">{{ link.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["links"])
  },
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>