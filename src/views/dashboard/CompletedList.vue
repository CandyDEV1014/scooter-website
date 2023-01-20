<template>
  <v-card class="mx-auto" style="height: 100%">
    <v-card-title class="success white--text dialog-title">
      TROTINETE IN FINALIZATE
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalRecords"
        @update:options="getScooterList()"
      >
        <template v-slot:top>
          <v-row class="ma-1">
            <v-col xs="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                @input="onSearchInput"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.updatedAt`]="{ item }">
          {{ item.createdAt ? setDateFormat(item.createdAt) : "Not Available" }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                color="success"
                class="mr-2"
                @click="onViewClick(item)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-eye
              </v-icon>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                color="primary"
                class="mr-2"
                @click="onEditClick(item)"
                v-bind="attrs"
                v-on="on"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>Edit</span>
          </v-tooltip>
        </template>
      </v-data-table></v-card-text
    >
    <v-snackbar v-model="snackBar.enabled" timeout="3000">
      {{ snackBar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackBar.enabled = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <view-dialog
      v-model="viewDialog"
      :selected-item="selectedViewItem"
      @close="viewDialog = false"
    />
    <edit-dialog
      v-model="editDialog"
      :selected-item="selectedEditItem"
      @close="editDialog = false"
      @submit="updateScooter"
    />
  </v-card>
</template>

<script>
import ViewDialog from "../scooter/ViewDialog.vue";
import EditDialog from "../scooter/EditDialog.vue";

import dayjs from "dayjs";

export default {
  name: "CompletedList",
  components: {
    ViewDialog,
    EditDialog,
  },
  data() {
    return {
      options: {},
      search: "",
      headers: [
        { text: "Name", value: "name" },
        { text: "Phone", value: "phone" },
        { text: "Barcode", value: "barcode" },
        { text: "Model", value: "model" },
        { text: "Price", value: "price" },
        { text: "Date", value: "updatedAt" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [],
      totalRecords: 0,

      snackBar: {
        enabled: false,
        message: "",
      },

      viewDialog: false,
      editDialog: false,

      selectedViewItem: {},
      selectedEditItem: {},
    };
  },
  created() {
    this.getScooterList();
  },
  methods: {
    onSearchInput() {
      this.getScooterList();
    },
    setDateFormat(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
    getScooterList() {
      this.$http
        .get("scooter", {
          params: {
            page: this.options.page,
            sort_by: this.options.sortBy ? this.options.sortBy[0] : null,
            descending: this.options.sortDesc ? this.options.sortDesc[0] : null,
            rows_per_page: this.options.itemsPerPage,
            search: this.search,
            status: 2,
          },
        })
        .then((response) => {
          if (response.data) {
            this.items = response.data.result;
            this.totalRecords = response.data.count;
          }
        })
        .catch((error) => {});
    },
    onViewClick(item) {
      this.selectedViewItem = item;
      this.viewDialog = true;
    },
    onEditClick(item) {
      this.selectedEditItem = item;
      this.editDialog = true;
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
  font-size: 16px !important;
  font-weight: 500;
  line-height: 24px;
}
</style>
