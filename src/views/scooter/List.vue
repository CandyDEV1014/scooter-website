<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :sort-by="['id']"
          :sort-desc="true"
          :options.sync="options"
          :server-items-length="totalRecords"
          @update:options="getScooterList()"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Scooter List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2 mr-2"
                @click="onAddClick()"
              >
                Create
              </v-btn>
              <!-- <v-btn color="primary" dark class="mb-2">Import</v-btn> -->
            </v-toolbar>
            <v-row class="ma-1">
              <v-col xs="6" sm="4" md="3">
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
          <template v-slot:[`item.createdAt`]="{ item }">
            {{
              item.createdAt ? setDateFormat(item.createdAt) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.updatedAt`]="{ item }">
            {{
              item.updatedAt ? setDateFormat(item.updatedAt) : "Not Available"
            }}
          </template>
          <template v-slot:[`item.statusId`]="{ item }">
            <v-chip :color="getStatus(item.statusId).color" dark>
              {{ getStatus(item.statusId).name }}
            </v-chip>
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
                  @click="onEditClick(item.id)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  small
                  color="red"
                  class="mr-2"
                  @click="onDeleteClick(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="snackBar.enabled"
      timeout="3000"
      :color="snackBar.type"
      top
      right
    >
      {{ snackBar.message }}
    </v-snackbar>
    <add-dialog
      v-model="addDialog"
      @close="addDialog = false"
      @submit="addScooter"
    />
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
    <delete-dialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @confirm="deleteScooter"
    />
  </div>
</template>

<script>
import AddDialog from "./AddDialog.vue";
import ViewDialog from "./ViewDialog.vue";
import EditDialog from "./EditDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";

import dayjs from "dayjs";
import get from "get-value";

export default {
  name: "ScooterList",
  components: {
    AddDialog,
    ViewDialog,
    EditDialog,
    DeleteDialog,
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
        { text: "Termen", value: "termen" },
        { text: "Problem", value: "problem" },
        { text: "Price", value: "price" },
        { text: "Created Date", value: "createdAt" },
        { text: "Updated Date", value: "updatedAt" },
        { text: "Status", value: "statusId", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [],
      totalRecords: 0,

      snackBar: {
        type: "default",
        enabled: false,
        message: "",
      },

      addDialog: false,
      viewDialog: false,
      editDialog: false,
      deleteDialog: false,

      selectedViewItem: {},
      selectedEditItem: {},
      selectedDeleteItem: {},
    };
  },
  created() {
    this.getScooterList();
  },
  mounted() {},
  methods: {
    getValue(resource, key) {
      return get(resource, key);
    },
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
          },
        })
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            this.items = response.data.result;
            this.totalRecords = response.data.count;
          }
        })
        .catch((error) => {});
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "NewIN LUCRU",
            color: "#1e88e5",
          };

        case 2:
          return {
            id: 2,
            name: "FINALIZAT",
            color: "#4caf50",
          };
        case 3:
          return {
            id: 3,
            name: "IESIT",
            color: "#fb8c00",
          };
        default:
          return {
            id: 1,
            name: "NewIN LUCRU",
            color: "#1e88e5",
          };
      }
    },
    onAddClick() {
      this.addDialog = true;
    },
    onViewClick(item) {
      this.selectedViewItem = item;
      this.viewDialog = true;
    },
    onEditClick(id) {
      this.$http
        .get("scooter/" + id)
        .then((response) => {
          if (response.status === 200) {
            this.selectedEditItem = response.data.result;
            this.editDialog = true;
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot get user";
        });
    },
    onDeleteClick(item) {
      this.selectedDeleteItem = item;
      this.deleteDialog = true;
    },
    addScooter(form) {
      this.$http
        .post("scooter", form)
        .then((response) => {
          if (response.status === 200) {
            this.addDialog = false;
            this.getScooterList();
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully create Scooter";
          } else {
            this.snackBar.type = "error";
            this.snackBar.enabled = true;
            this.snackBar.message = "Cannot create Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot create Scooter";
        });
    },
    updateScooter({ form, images }) {
      if (images.length) {
        images.map((image) => {
          const formData = new FormData();
          formData.append("file", image.file);
          this.$http
            .post("scooter/uploadSignature", formData, {
              headers: { "X-Requested-With": "XMLHttpRequest" },
            })
            .then((response) => {
              if (response.status === 200) {
                form.signature = response.data.filename;
                this.$http
                  .put("scooter", form)
                  .then((response) => {
                    if (response.status === 200) {
                      this.editDialog = false;
                      this.getScooterList();
                      this.snackBar.type = "success";
                      this.snackBar.enabled = true;
                      this.snackBar.message = "Successfully update Scooter";
                    }
                  })
                  .catch((error) => {
                    this.snackBar.type = "error";
                    this.snackBar.enabled = true;
                    this.snackBar.message = "Cannot update Scooter";
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
      } else {
        this.$http
          .put("scooter", form)
          .then((response) => {
            if (response.status === 200) {
              this.editDialog = false;
              this.getScooterList();
              this.snackBar.type = "success";
              this.snackBar.enabled = true;
              this.snackBar.message = "Successfully update Scooter";
            }
          })
          .catch((error) => {
            this.snackBar.type = "error";
            this.snackBar.enabled = true;
            this.snackBar.message = "Cannot update Scooter";
          });
      }
    },
    deleteScooter() {
      this.$http
        .delete("scooter/" + this.selectedDeleteItem.id)
        .then((response) => {
          if (response.status === 200) {
            this.getScooterList();
            this.deleteDialog = false;
            this.selectedDeleteItem = {};
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully delete Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot delete Scooter";
        });
    },
  },
};
</script>
