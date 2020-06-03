import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App.vue';
import routes from './routes';

import * as nacl from 'tweetnacl';

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({routes});

new Vue({
  router,
  render: h => h(App),
  data: {
    key: [],
  },
  methods: {
    newKey: function () {
      this.key = nacl.randomBytes(32);
    },
    b2h: function (b) {
      // https://stackoverflow.com/a/34356351
      let hex = [], i = 0;
      for (; i < b.length; i++) {
          let current = b[i] < 0 ? b[i] + 256 : b[i];
          hex.push((current >>> 4).toString(16));
          hex.push((current & 0xf).toString(16));
      }
      return hex.join("");
    }
  }
}).$mount('#app')
