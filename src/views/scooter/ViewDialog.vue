<template>
  <v-dialog v-bind="$attrs" v-on="$listeners" persistent width="500" eager>
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title class="dialog-title"> View Scooter </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-3">
          <v-simple-table height="400px">
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="item-title">Name</td>
                  <td class="item-value">
                    {{ item.name }}
                  </td>
                </tr>
                <tr>
                  <td class="item-title">Phone</td>
                  <td class="item-value">{{ item.phone }}</td>
                </tr>
                <tr>
                  <td class="item-title">Barcode</td>
                  <td class="item-value">{{ item.barcode }}</td>
                </tr>
                <tr>
                  <td class="item-title">Model</td>
                  <td class="item-value">{{ item.model }}</td>
                </tr>
                <tr>
                  <td class="item-title">Termen</td>
                  <td class="item-value">{{ item.termen }}</td>
                </tr>
                <tr>
                  <td class="item-title">Problem</td>
                  <td class="item-value">{{ item.problem }}</td>
                </tr>
                <tr>
                  <td class="item-title">Price</td>
                  <td class="item-value">{{ item.price }}</td>
                </tr>
                <tr>
                  <td class="item-title">Solved</td>
                  <td class="item-value">{{ item.solved }}</td>
                </tr>
                <tr>
                  <td class="item-title">Price</td>
                  <td class="item-value">{{ item.price }}</td>
                </tr>
                <tr>
                  <td class="item-title">Status</td>
                  <td class="item-value">
                    <v-chip :color="getStatus(item.statusId).color" dark>
                      {{ getStatus(item.statusId).name }}
                    </v-chip>
                  </td>
                </tr>
                <tr>
                  <td class="item-title">Signature</td>
                  <td class="item-value"></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" small @click="handlePrint"> Print PDF </v-btn>
          <v-btn color="primary" small @click="handleClose"> Close </v-btn>
        </v-card-actions>
      </v-card>
      <VueHtml2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="download"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="100%"
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <pdf-content :item="item" />
        </section>
      </VueHtml2pdf>
    </v-sheet>
  </v-dialog>
</template>

<script>
import PdfContent from "./PdfContent";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "ViewDialog",
  components: {
    PdfContent,
    VueHtml2pdf,
  },
  props: {
    selectedItem: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    selectedItem: function (newValue) {
      this.item = newValue;
    },
  },
  data() {
    return {
      item: this.selectedItem,
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    handlePrint() {
      this.$refs.html2Pdf.generatePdf();
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "NewIN LUCRU",
            color: "#4caf50",
          };

        case 2:
          return {
            id: 2,
            name: "FINALIZAT",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: 3,
            name: "IESIT",
            color: "#fb8c00",
          };
        default:
          return {
            id: id,
            name: "NewIN LUCRU",
            color: "#4caf50",
          };
      }
    },
    updateScooter(form) {
      this.$http
        .put("scooter", form)
        .then((response) => {
          if (response.status === 200) {
            this.editDialog = false;
            this.getScooterList();
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully update Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot update Scooter";
        });
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
.v-card__actions {
  padding: 10px 16px;
}
td.item-title {
  font-weight: 600;
}
</style>
