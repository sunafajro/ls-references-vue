<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['mode']),
  },
  async created() {
    const promises = [
      this.getCSRFToken(),
      this.getMenuLinks(),
      this.getUserInfo(),
    ];
    if (this.mode === 'bitrix') {
      promises.push(this.getNavLinks());
    }
    await Promise.all(promises);
  },
  methods: {
    ...mapActions(['getCSRFToken', 'getMenuLinks', 'getNavLinks', 'getUserInfo']),
  },
};
</script>

