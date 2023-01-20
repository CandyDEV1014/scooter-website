<template>
  <div>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalRecords"
          @update:options="getUserList()"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>User List</v-toolbar-title>
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
          <template v-slot:[`item.roleId`]="{ item }">
            <v-chip :color="getRole(item.roleId).color" dark>
              {{ getRole(item.roleId).name }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
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
                  color="success"
                  class="mr-2"
                  @click="onResetClick(item)"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-lock-off
                </v-icon>
              </template>
              <span>Reset</span>
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
      @submit="addUser"
    />
    <edit-dialog
      v-model="editDialog"
      :selected-item="selectedEditItem"
      @close="editDialog = false"
      @submit="updateUser"
    />
    <reset-dialog
      v-model="resetDialog"
      @cancel="resetDialog = false"
      @confirm="resetPassword"
    />
    <delete-dialog
      v-model="deleteDialog"
      @cancel="deleteDialog = false"
      @confirm="deleteUser"
    />
  </div>
</template>

<script>
import AddDialog from "./AddDialog.vue";
import EditDialog from "./EditDialog.vue";
import ResetDialog from "./ResetDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";

import dayjs from "dayjs";
import get from "get-value";

export default {
  name: "UserList",
  components: {
    AddDialog,
    EditDialog,
    ResetDialog,
    DeleteDialog,
  },
  data() {
    return {
      options: {},
      search: "",
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Created Date", value: "createdAt" },
        { text: "Updated Date", value: "updatedAt" },
        { text: "Role", value: "roleId", sortable: false },
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
      editDialog: false,
      resetDialog: false,
      deleteDialog: false,

      selectedEditItem: {},
      selectedResetItem: {},
      selectedDeleteItem: {},
    };
  },
  created() {
    this.getUserList();
  },
  mounted() {},
  methods: {
    getValue(resource, key) {
      return get(resource, key);
    },
    onSearchInput() {
      this.getUserList();
    },
    setDateFormat(date) {
      return dayjs(date).format("DD/MM/YYYY");
    },
    getUserList() {
      this.$http
        .get("user", {
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
            this.items = response.data.result;
            this.totalRecords = response.data.count;
          }
        })
        .catch((error) => {});
    },
    getRole(id) {
      switch (id) {
        case 1:
          return {
            id: 1,
            name: "Admin",
            color: "#4caf50",
          };

        case 2:
          return {
            id: 2,
            name: "Member",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: 3,
            name: "User",
            color: "#fb8c00",
          };
        default:
          return {
            id: 3,
            name: "User",
            color: "#fb8c00",
          };
      }
    },
    onAddClick() {
      this.addDialog = true;
    },
    onEditClick(id) {
      this.$http
        .get("user/" + id)
        .then((response) => {
          console.log(response);
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
    onResetClick(item) {
      this.selectedResetItem = item;
      this.resetDialog = true;
    },
    onDeleteClick(item) {
      this.selectedDeleteItem = item;
      this.deleteDialog = true;
    },
    addUser(form) {
      this.$http
        .post("user", form)
        .then((response) => {
          if (response.status === 200) {
            this.addDialog = false;
            this.getUserList();
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully create user";
          } else {
            this.snackBar.enabled = true;
            this.snackBar.message = response.data.message;
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot create user";
        });
    },
    updateUser(form) {
      this.$http
        .put("user", form)
        .then((response) => {
          if (response.status === 200) {
            this.editDialog = false;
            this.getUserList();
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully update user";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot update user";
        });
    },
    resetPassword() {
      this.$http
        .post("user/resetPassword", { id: this.selectedResetItem.id })
        .then((response) => {
          if (response.status === 200) {
            this.resetDialog = false;
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully reset password";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot reset password";
        });
    },
    deleteUser() {
      this.$http
        .delete("user/" + this.selectedDeleteItem.id)
        .then((response) => {
          if (response.status === 200) {
            this.getUserList();
            this.deleteDialog = false;
            this.selectedDeleteItem = {};
            this.snackBar.type = "success";
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully delete user";
          }
        })
        .catch((error) => {
          this.snackBar.type = "error";
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot delete user";
        });
    },
  },
};
</script>
