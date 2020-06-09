<template>
  <div class="content">
    <nav><router-link to="/">Home</router-link></nav>
    <label for="nick">Nickname:  </label><input type="text" id="nick" name="nick" placeholder="anonymous" />
    <p>This room's key is <span class="hl">{{ b2h(this.key) }}</span></p>
    <div id="chat">
      <div id="history-div">
        <ul id="history-list">
          <li v-for="message in messages" v-bind:key="message.id">{{ message.time }} :: [<span class="name">{{ message.author }}</span>] {{ message.text }}</li>
        </ul>
        <span id="buffer"></span>
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
// https://gist.github.com/72lions/4528834
var _appendBuffer = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

import * as nacl from 'tweetnacl';
export default {
  name: "Chat",
  data() {
    return {
      key: new Uint8Array(),
      roomID: "",
      socket: null,
      messages: [],
    }
  },
  methods: {
    b2h(b) {
      // https://stackoverflow.com/a/34356351
      let hex = [];
      let i = 0;
      for (; i < b.length; i++) {
          let current = b[i] < 0 ? b[i] + 256 : b[i];
          hex.push((current >>> 4).toString(16));
          hex.push((current & 0xf).toString(16));
      }
      return hex.join("");
    },
    encrypt(m) {
      let nonce = nacl.randomBytes(24);
      let ciphertext = nacl.secretbox(new Uint8Array(m), nonce, this.key);
      return _appendBuffer(nonce, ciphertext);
    },
    decrypt(c) {
      return nacl.secretbox.open(c.subarray(24), c.subarray(0, 24), this.key);
    },
    logMessage(author, message) {
      this.messages.push({
        id: window.performance.now(),
        time: new Date().toLocaleTimeString(),
        author: author,
        text: message,
      });
      document.getElementById('buffer').scrollIntoView(false, { behavior: 'smooth', block: 'end' });
    },
    sendMessage() {
      // parse nickname
      let nickname = document.getElementById("nick").value.trim();
      nickname = (nickname != "" && nickname != null) ? nickname : "anonymous";

      // parse message
      let msg = document.getElementById("message").value.trim();
      if (msg == "") {
        document.getElementById("message").value = "";
        return;
      }

      // construct payload
      let payload = JSON.stringify({
        author: nickname,
        text: msg,
      });

      // perform encryption
      let encrypted = this.encrypt(payload);

      // send to server
      this.socket.send(encrypted);

      // log to local chat window
      this.logMessage(nickname, msg);

      // clear message input field
      document.getElementById("message").value = "";
    },
    parseMessage() {

    }
  },
  mounted() {
    // If there's no key defined, go to the homepage and ask for one.
    if (this.$parent.key.length == 0) {
      this.$router.push("/");
      return;
    }

    // Setup local state
    this.key = new Uint8Array(this.$parent.key);
    this.roomID = this.b2h(nacl.hash(this.key).subarray(0, 32));

    // Connect to websocket server
    // SHOLD BE REPLACED WITH WSS:// WHEN TLS IS ADDED
    this.socket = new WebSocket("ws://127.0.0.1:4444", this.roomID);

    // Display connection message
    this.logMessage("info", "connection established");
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
