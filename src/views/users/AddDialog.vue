<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="450" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> Add User </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 500px; overflow-y: auto">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-container fluid class="px-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    color="primary"
                    label="Name"
                    v-model="form.name"
                    :rules="rules.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    color="primary"
                    label="Email"
                    v-model="form.email"
                    :rules="rules.email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    color="primary"
                    label="Role"
                    placeholder="Select a Roles"
                    :items="roles"
                    v-model="form.roleId"
                    item-text="title"
                    item-value="id"
                    :rules="rules.roleId"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn color="error" small @click="handleClose"> Close </v-btn>
          <v-btn color="primary" small @click="handleSubmit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "AddDialog",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        email: "",
        roleId: null,
      },
      rules: {
        name: [(v) => !!v || "Name is required"],
        email: [
          (v) => !!v || "Email is required",
          (v) =>
            !v ||
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "E-mail must be valid",
        ],
        roleId: [(v) => !!v || "Role is required"],
      },
      valid: true,
      roles: [
        { id: 1, title: "Admin" },
        { id: 2, title: "Member" },
        { id: 3, title: "User" },
      ],
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
      this.$refs.form.resetValidation();
    },
    handleSubmit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.$emit("submit", this.form);
        this.$refs.form.resetValidation();
      }
    },
  },
};
</script>
<style scoped>
.dialog-title {
  font-size: 18px !important;
  font-weight: 500;
  line-height: 24px;
}
.dialog_actions {
  padding: 10px 16px;
}
</style>
