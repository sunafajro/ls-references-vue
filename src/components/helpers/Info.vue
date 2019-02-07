<template>
  <div class="well well-sm small" v-if="typeof user === 'object' && Object.keys(user).length">
    <div v-if="!user.teacherId">
      <b v-if="user.name">{{ user.name }}</b>
    </div>
    <div v-if="user.teacherId">
      <b v-if="user.name">
        <a :href="`/teacher/view?id=${user.teacherId}`">{{ user.name }}</a>
      </b>
    </div>
    <div v-if="user.role">
      <i>{{ user.role }}</i>
    </div>
    <div v-if="user.roleId === '4'">{{ user.office }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"])
  }
};
</script>