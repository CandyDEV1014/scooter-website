<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="350" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> Delete User </v-card-title>
        <v-card-text> Do you want to delete this user? </v-card-text>
        <v-card-actions>
          <v-btn
            small
            color="error"
            class="text-capitalize btn"
            @click="confirm"
          >
            Confirm
          </v-btn>
          <v-btn
            small
            color="white"
            class="text-capitalize btn"
            @click="cancel"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style scoped>
.v-card {
  padding: 24px;
}
.v-card__title {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  color: #111827;
}
.v-card__text {
  padding: 0;
  padding-top: 0.5rem;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #6b7280;
}
.v-card__actions {
  padding: 0;
  padding-top: 1rem;
}
</style>
