<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="600" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> Edit Scooter </v-card-title>
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
                <v-col cols="12" sm="12">
                  <v-text-field
                    color="primary"
                    label="Name"
                    v-model="form.name"
                    :rules="rules.name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    color="primary"
                    label="Phone Number"
                    v-model="form.phone"
                    :rules="rules.phone"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    color="primary"
                    label="Barcode"
                    v-model="form.barcode"
                    :rules="rules.barcode"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    color="primary"
                    label="Model"
                    v-model="form.model"
                    :rules="rules.model"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    color="primary"
                    label="TERMEN APROXIMATIV"
                    v-model="form.termen"
                    :rules="rules.termen"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    color="primary"
                    label="Problem"
                    :rows="3"
                    v-model="form.problem"
                    :rules="rules.problem"
                    required
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    color="primary"
                    label="Content"
                    :rows="3"
                    v-model="form.content"
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    color="primary"
                    label="Price"
                    v-model="form.price"
                    :rules="rules.price"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    color="primary"
                    label="Status"
                    placeholder="Select a Status"
                    :items="status"
                    v-model="form.statusId"
                    item-text="title"
                    item-value="id"
                    :rules="rules.status"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <div class="signature-wrapper" v-if="form.signature">
                    <span class="text-caption">Signature</span>
                    <div class="signature-img">
                      <v-btn
                        x-small
                        icon
                        color="white"
                        class="close-btn"
                        style="background: #ff5252"
                        @click="removeSignature()"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      <v-img
                        :src="require(`/public/uploads/${form.signature}`)"
                        alt="signature"
                        max-height="150"
                        max-width="120"
                      ></v-img>
                    </div>
                  </div>
                  <vuetify-upload
                    v-else
                    :max="1"
                    can-delete
                    accept="image/*"
                    color="accent"
                    v-model="images"
                  ></vuetify-upload>
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
  name: "EditDialog",
  components: {},
  props: {
    selectedItem: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    selectedItem: function (newValue) {
      this.form = newValue;
    },
  },
  data() {
    return {
      form: this.selectedItem,
      images: [],
      rules: {
        name: [(v) => !!v || "Name is required"],
        phone: [(v) => !!v || "Phone Number is required"],
        barcode: [
          (v) => !!v || "Barcode is required",
          (v) => Number.isInteger(Number(v)) || "Barcode must be a number",
        ],
        model: [(v) => !!v || "Model is required"],
        termen: [(v) => !!v || "TERMEN APROXIMATIV is required"],
        problem: [(v) => !!v || "Problem is required"],
        price: [
          (v) => !!v || "Price is required",
          (v) => Number.isInteger(Number(v)) || "Price must be a number",
        ],
        status: [(v) => !!v || "Status is required"],
        imageRules: [(v) => v.length > 0 || "This image is required"],
      },
      valid: true,
      status: [
        { id: 1, title: "IN LUCRU" },
        { id: 2, title: "FINALIZAT" },
        { id: 3, title: "IESIT" },
      ],
    };
  },
  methods: {
    removeSignature() {
      this.form.signature = "";
    },
    handleClose() {
      this.$emit("close");
      this.$refs.form.resetValidation();
    },
    handleSubmit() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        console.log(this.images);
        this.$emit("submit", { form: this.form, images: this.images });
        this.$refs.form.resetValidation();
        this.images = [];
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
.signature-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.signature-img {
  position: relative;
  padding: 10px;
  padding-left: 0;
}
.close-btn {
  position: absolute;
  overflow: hidden;
  z-index: 9999999;
  right: 0;
  top: 0;
}
</style>
