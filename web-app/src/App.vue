<template>
  <div id="app">
    <router-view v-on:key="setKey" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      key: new Uint8Array(),
    }
  },
  methods: {
    setKey(k) {
      this.key = new Uint8Array(k);
      this.$router.push("/chat");
    }
  }
};
</script>

<style scoped>
</style>
