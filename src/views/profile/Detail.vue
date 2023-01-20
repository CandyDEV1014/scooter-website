<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card style="width: 100%; max-width: 600px">
          <v-card-text>
            <div class="mb-4 d-flex justify-center">
              <v-avatar size="150" style="border: 5px solid rgba(0, 0, 0, 0.1)">
                <img :src="require('@/assets/avatar.png')" alt="Avatar" />
              </v-avatar>
            </div>
            <v-tabs
              v-model="activeTab"
              color="primary"
              centered
              background-color="transparent"
              hide-slider
              :height="32"
            >
              <v-tab v-for="item in tabItems" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="activeTab">
              <v-tab-item v-for="item in tabItems" :key="item">
                <ProfileForm v-if="item === 'profile'" />
                <PasswordForm v-else />
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProfileForm from "./ProfileForm.vue";
import PasswordForm from "./PasswordForm.vue";

export default {
  pageTitle: "My Profile",
  components: {
    ProfileForm,
    PasswordForm,
  },
  data() {
    return {
      activeTab: null,
      tabItems: ["profile", "password"],
    };
  },
  methods: {},
};
</script>
