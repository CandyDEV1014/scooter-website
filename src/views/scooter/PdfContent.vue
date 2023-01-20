<template>
  <v-container style="padding: 70px">
    <v-row>
      <v-col cols="12" style="display: flex; justify-content: center">
        <img :src="require('@/assets/logo_big.jpg')" width="87" />
      </v-col>
    </v-row>
    <v-row style="margin-top: 8px; margin-bottom: 32px">
      <v-col cols="12">
        <h1
          style="
            color: #000;
            text-align: center;
            font-size: 30px;
            font-weight: 700;
          "
        >
          Proces verbal de intrare in service
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="black-text">Nume / Prenume : </span>
        <span class="black-text">{{ item.name }}</span>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <span class="black-text">Telefon : </span>
            <span class="black-text">{{ item.phone }}</span>
          </v-col>
          <v-col cols="12">
            <span class="black-text">CODBARE : </span>
            <span class="black-text">{{ item.barcode }}</span>
          </v-col>
          <v-col cols="12">
            <span class="black-text">MODEL : </span>
            <span class="black-text">{{ item.model }}</span>
          </v-col>
          <v-col cols="12">
            <span class="black-text">TERMEN : </span>
            <span class="black-text">{{ item.termen }}</span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <span class="black-text">SEMNATURA </span>
            <span class="black-text"></span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="black-text">Probleme : </span>
        <div
          style="
            width: 100%;
            min-height: 150px;
            border: 2px solid #48bb78;
            margin-top: 5px;
          "
        >
          <p style="padding: 10px; text-align: left">
            {{ item.problem }}
          </p>
        </div>
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 16px">
      <v-col cols="12">
        <span class="black-text">Cost reparatie : </span>
        <span class="black-text text-uppercase">{{ item.price }} LEI</span>
      </v-col>
      <v-col cols="12">
        <span class="red-text"
          >Am luat la cunostinta pretul si termenul de executie al
          lucrarii.</span
        >
      </v-col>
      <v-col cols="12">
        <span class="checkbox"
          >Sunt de acord cu preluarea si prelucrarea datelor cu caracter
          personal conform procedurii GDPR</span
        >
      </v-col>
    </v-row>
    <v-row style="margin-bottom: 32px">
      <v-col cols="5">
        <v-row>
          <v-col cols="12"
            ><span class="black-text">DOCTOR TROTINETA</span></v-col
          >
          <v-col cols="12"
            ><span class="black-text">0215553934/ 0723110511</span></v-col
          >
          <v-col cols="12"
            ><span class="black-text">www.doctortrotineta.ro</span></v-col
          >
        </v-row>
      </v-col>
      <v-col cols="7">
        <span class="black-text">DATA : {{ formatDate(item.createdAt) }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <span class="red-text" style="font-weight: 600">
          ATENTIE! Neridicarea trotinetelor in termen de 48h aduce o taxa
          suplimentara in valoare de 10lei/zi.
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "PdfContent",
  components: {},
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format("D.MMM.YYYY");
    },
  },
};
</script>
<style scoped>
.black-text {
  color: #000;
}
.red-text {
  color: #ff0000;
}
.checkbox {
  display: flex;
  align-items: center;
  color: #000;
  line-height: 1;
}
.checkbox::before {
  content: "";
  display: inline-block;
  width: 17px;
  height: 17px;
  margin-right: 10px;
  background: #4299e1;
  border-radius: 3px;
}
</style>
