<template>
  <div class="content">
    <h1 class="title">Ephemeral</h1>
    <div class="form">
        <form v-on:submit.prevent="existingRoom">
            <input type="text" id="key" name="key" autocomplete="off" placeholder="Room Key" />
            <div id="home-buttons">
              <button id="new-room" type="button" v-on:click="newRoom">Create New Room</button>
              <input id="existing-room" type="submit" value="Join Existing Room" />
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import * as nacl from 'tweetnacl';
export default {
  name: "Home",
  methods: {
    newRoom() {
      this.$emit("key", nacl.randomBytes(32));
    },
    existingRoom() {
      let r = /^[A-Fa-f0-9]{64}$/;
      let k = document.getElementById("key").value;
      if (!r.test(k)) {
        alert("Invalid key");
        return;
      }
      let key = [];
      for (let i = 0; i < k.length; i += 2) {
        key.push(parseInt(k.substr(i, 2), 16));
      }
      this.$emit("key", key);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#key {
  padding: 10px;
  border-radius: 14px;
  border: 2px solid black;
  font-size: 24px;
}

#new-room, #existing-room {
  padding: 12px;
  font-size: 18px;
  border-radius: 6px;
  background-color: var(--light-blue);
  border: 2px solid black;

}

@media screen and (max-width: 1200px) {
  h1 {
    font-size: 84px;
    margin-bottom: 16px;
  }
  #key {
    font-size: 20px;
    padding: 8px;
  }
  #new-room, #existing-room {
    padding:8px;
    font-size: 14px;
    margin: 4px;
  }
  #home-buttons {
    margin: 20px;
  }
}

</style>
