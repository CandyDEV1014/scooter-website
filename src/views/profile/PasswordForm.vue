<template>
  <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
    <v-text-field
      :append-icon="showCurrent ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required]"
      :type="showCurrent ? 'text' : 'password'"
      v-model="form.password"
      name="current-password"
      label="Current Password"
      @click:append="showCurrent = !showCurrent"
    ></v-text-field>
    <v-text-field
      :append-icon="showNew ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min, rules.duplicate]"
      :type="showNew ? 'text' : 'password'"
      v-model="form.newPassword"
      name="new-password"
      label="New Password"
      hint="At least 8 characters"
      counter
      @click:append="showNew = !showNew"
    ></v-text-field>
    <v-text-field
      :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min, rules.confirm]"
      :type="showConfirm ? 'text' : 'password'"
      v-model="form.confirmPassword"
      name="confirm-password"
      label="Confirm Password"
      hint="At least 8 characters"
      counter
      @click:append="showConfirm = !showConfirm"
    ></v-text-field>
    <v-btn
      class="mt-3"
      color="primary"
      :loading="loading"
      @click.native="handleUpdate"
    >
      <v-icon left dark>mdi-check</v-icon>
      Save Changes
    </v-btn>
    <v-snackbar
      v-model="snackBar.enabled"
      timeout="3000"
      :color="snackBar.type"
      top
      right
    >
      {{ snackBar.message }}
    </v-snackbar>
  </v-form>
</template>

<script>
export default {
  name: "ProfileForm",
  components: {},
  data() {
    return {
      form: {
        password: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        required: (value) => !!value || "This field is Required.",
        min: (v) => !v || v.length >= 8 || "Min 8 characters",
        duplicate: (v) =>
          v !== this.form.password || `You are using same password!`,
        confirm: (v) =>
          v === this.form.newPassword ||
          `The password confirmation does not match.`,
      },
      showCurrent: false,
      showNew: false,
      showConfirm: false,
      valid: true,
      loading: false,
      snackBar: {
        type: "default",
        enabled: false,
        message: "",
      },
    };
  },
  methods: {
    async handleUpdate() {
      this.loading = true;
      this.$http
        .post("user/updatePassword", this.form)
        .then((response) => {
          this.loading = false;
          if (response.data.status === "error") {
            this.snackBar.type = "error";
            this.snackBar.enabled = true;
            this.snackBar.message = response.data.message;
          } else {
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = response.data.message;
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot update password";
        });
    },
  },
};
</script>
