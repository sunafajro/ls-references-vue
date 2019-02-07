<template>
  <div class="dropdown" style="margin-bottom: 0.5rem">
    <button
      class="btn btn-default btn-block dropdown-toggle"
      type="button"
      id="mainDropdownMenu"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="true"
    >
      <i class="fa fa-bars" aria-hidden="true"></i> Меню
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" aria-labelledby="mainDropdownMenu">
      <li :key="item.id" v-for="item in navLinks">
        <a :href="item.url">
          <i :class="item.classes" aria-hidden="true"></i>
          {{item.title}}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["navLinks"])
  }
};
</script>
