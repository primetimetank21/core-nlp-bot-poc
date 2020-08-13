import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false;

// firestore should give us realtime updating
Vue.use(firestorePlugin);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
