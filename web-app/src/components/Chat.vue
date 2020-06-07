<template>
  <div class="content">
    <nav><router-link to="/">Home</router-link></nav>
    <p>This room's key is <span class="hl">{{ b2h(this.$parent.key) }}</span></p>
    <div id="chat">
      <div id="history"></div>
      <div id="input">
        <form>
          <input type="text" id="message" autocomplete="off" />
          <input type="submit" value="send" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      key: [],
      id: "",
      history: [],
    }
  },
  methods: {
    b2h(b) {
      // https://stackoverflow.com/a/34356351
      let hex = [], i = 0;
      for (; i < b.length; i++) {
          let current = b[i] < 0 ? b[i] + 256 : b[i];
          hex.push((current >>> 4).toString(16));
          hex.push((current & 0xf).toString(16));
      }
      return hex.join("");
    }
  },
  mounted() {
    // If there's no key defined, go to the homepage and ask for one.
    if (this.$parent.key.length == 0) {
      this.$router.push("/");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
