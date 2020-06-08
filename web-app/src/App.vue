<template>
  <div id="app">
    <router-view v-on:key="setKey" />
  </div>
</template>

<script>
function b2h(b) {
  // https://stackoverflow.com/a/34356351
  let hex = [], i = 0;
  for (; i < b.length; i++) {
      let current = b[i] < 0 ? b[i] + 256 : b[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xf).toString(16));
  }
  return hex.join("");
}

export default {
  name: "App",
  data() {
    return {
      key: [],
    }
  },
  methods: {
    setKey(k) {
      this.key = k;
      this.$router.push("/chat");
    }
  }
};
</script>

<style scoped>
</style>
