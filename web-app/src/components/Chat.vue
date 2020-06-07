<template>
  <div class="content">
    <nav><router-link to="/">Home</router-link></nav>
    <p>This room's key is <span class="hl">{{ b2h(this.key) }}</span></p>
    <div id="chat">
      <div id="history-div">
        <ul id="history-list">
          <li v-for="message in messages" v-bind:key="message.id">{{ message.time}} :: <span class="name">{{ message.author }}</span>: {{ message.text }}</li>
        </ul>
      </div>
      <div id="input">
        <form v-on:submit.prevent="sendMessage">
          <input type="text" id="message" autocomplete="off" />
          <input id="send" type="submit" value="send" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as nacl from 'tweetnacl';
export default {
  name: "Chat",
  data() {
    return {
      key: [],
      roomID: "",
      messages: [{
        id: 0,
        time: 0,
        author: "alice",
        text: "test"
      }],
    }
  },
  methods: {
    b2h(b) {
      // https://stackoverflow.com/a/34356351
      let hex = [];
      for (let i = 0; i < b.length; i++) {
          let current = b[i] < 0 ? b[i] + 256 : b[i];
          hex.push((current >>> 4).toString(16));
          hex.push((current & 0xf).toString(16));
      }
      return hex.join("");
    },
    sendMessage() {
      // handle message
    }
  },
  mounted() {
    // If there's no key defined, go to the homepage and ask for one.
    if (this.$parent.key.length == 0) {
      this.$router.push("/");
      return;
    }

    // Setup local state
    this.key = this.$parent.key;
    this.roomID = this.b2h(nacl.hash(this.key).subarray(0, 32));
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
