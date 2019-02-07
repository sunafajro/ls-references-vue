<template>
  <table class="table table-striped table-hover table-condensed table-bordered small">
    <thead>
      <tr>
        <template v-for="column in columns">
          <th v-bind:key="column.id" v-if="column.show">{{column.name}}</th>
        </template>
        <th class="text-center" v-if="actions.delete">Дейст.</th>
      </tr>
    </thead>
    <tbody v-if="data.length">
      <tr v-for="(row, i) in data" v-bind:key="row.id">
        <template v-for="column in columns">
          <td
            v-bind:key="column.id + '-' + row.id"
            v-if="column.show"
          >{{ column.id === 'id' ? (i + 1) : row[column.id]}}</td>
        </template>
        <td class="text-center" v-if="actions.delete">
          <a href="#" v-on:click.stop="deleteRow(row.id)">
            <span class="fa fa-trash" aria-hidden="true"></span>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    actions: {
      type: Object,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteRow: function(id) {
      if (
        window.confirm(
          "Вы действительно хотите удалить элемент? Это действие нельзя отменить!"
        )
      ) {
        this.$emit("row-delete", id);
      }
    }
  }
};
</script>
