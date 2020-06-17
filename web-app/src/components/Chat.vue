<template>
  <div class="content">
    <nav><router-link to="/">Home</router-link></nav>
    <label for="nick">Nickname:  </label><input type="text" id="nick" name="nick" placeholder=" Anonymous" />
    <p id="key-message">This room's key is <span class="hl">{{ b2h(this.key) }}</span></p>
    <div id="chat">
      <div id="history-div">
        <ul id="history-list">
          <li v-for="message in messages" v-bind:key="message.id">{{ message.time }} :: [<span class="name">{{ message.author }}</span>] {{ message.text }}</li>
        </ul>
        <span id="buffer"></span>
      </div>
      <div id="input">
        <form v-on:submit.prevent="sendMessage">
          <input type="text" id="message" autocomplete="off" placeholder=" Type a message..." />
          <input id="send" type="submit" value="Send" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
var catbufs = function(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.length + buffer2.length);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

var b64tobytes = function(b64) {
    var binary_string = window.atob(b64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

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
      let message = new TextEncoder().encode(m);
      let nonce = nacl.randomBytes(24);
      let ciphertext = nacl.secretbox(message, nonce, this.key);
      return catbufs(nonce, ciphertext);
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
      if (this.socket == null) {
        return;
      }

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
    parseMessage(m) {
      // Decode message from JSON
      let payload = JSON.parse(m);
      let message = b64tobytes(payload.message);

      // Check if message came from server or another client
      if (payload.server === true) {
        this.logMessage("server", message);
        return;
      }

      // Decrypt message
      let decrypted = this.decrypt(new Uint8Array(message));
      let inner_payload = JSON.parse(new TextDecoder().decode(decrypted));

      // Log to chat window
      this.logMessage(inner_payload.author, inner_payload.text);
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
    let socket = new WebSocket("ws://127.0.0.1:8080", this.roomID);

    let component_instance = this;

    // attach event handlers
    socket.onopen = function() {
      component_instance.socket = socket;
      component_instance.logMessage("info", "connection established");
    };

    socket.onmessage = function(event) {
      component_instance.parseMessage(event.data);
    };

    socket.onclose = function(event) {
      component_instance.logMessage("info", "disconnected: " + event.reason);
      component_instance.socket = null;
    };

    socket.onerror = function(event) {
      component_instance.logMessage("error", event);
      component_instance.socket = null;
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nick {
  font-size: 20px;
  border-radius: 6px;
  padding: 6px;
}
#message {
  font-size: 18px;
  border-radius: 6px;
  padding: 14px;
}
#send {
  background-color: var(--light-blue);
  font-size: 20px;
  border-radius: 6px;
  padding: 15px;
  border: 0px;
}
#history-div{
  border-radius: 14px;
  height: 100%;

}
a {
  font-size: 20px;
  text-decoration: none;
  font-weight: bold;
  background-color: var(--link);
  color: black;
  padding: 6px 12px;
  border-radius: 6px;
}
@media screen and (max-width: 1200px) {
  a {
  font-size: 14px;
  padding: 6px 12px;
  }
  #nick {
    margin-top: 0px;
    font-size: 12px;
    margin-bottom:20px;
  }
  label {
    font-size: 18px;
    margin-bottom: 20px;
    }
  nav {
    width: 0% !important;
    float: left;
  }
  #key-message {
    margin-top:-10px;
  }
  #message {
    font-size: 12px;
    padding: 8px;
    margin-top: -2.5px;
  }
  #send {
    font-size: 12px;
    padding: 10px;
    margin-top: -2.5px;
  }
  .content {
    margin-top: -18px !important;
  }
}
@media screen and (max-width: 780px) {
  #nick {
    position: relative;
    }
  label {
    position: relative;
  }
  nav {
    width: auto !important;
  }
  #message, #send {
    position: fixed;
    bottom: 20px;
    
  }
  #key-message {
    font-size: 11px;
  }
  #message {
    font-size: 10px;
    padding: 6px;
    left: 20px;
    width: 75%;
    margin-top: 50px;
  }
  #send {
    font-size: 10.5px;
    margin: 0px;
    right: 20px;
    width: 14%;
    padding:7.8px ;
  }
}
@media screen and (max-width: 600px){
    #message {
    font-size: 12px;
    width: 74%;
    }
    #send {
      font-size: 12px;
    }
    #nick {
      font-size: 12px;
    }
    label {
      font-size: 12px;
    }
  }
@media screen and (max-width: 500px) {

  #message {
    width: 70%;
  }
}
@media screen and (max-height: 1280px) and (max-width: 1280px) {
  #history-div {
    height: 85vh;
  }
}
@media screen and (max-height: 1000px) and (max-width: 1280px){
  #history-div {
    height: 80vh;
  }
@media screen and (max-height: 780px) and (max-width: 1280px){
    #history-div {
      height: 78vh;
    }
  }
@media screen and (max-height: 700px) and (max-width: 1280px){
    #history-div {
      height: 75vh;
    }
  }
  @media screen and (max-height: 610px) and (max-width: 1280px){
      #history-div {
        height: 60vh;
    }
  }

}
</style>
