<template>
  <div class="content">
    <h1 class="title">Ephemeral</h1>
    <div class="form">
        <form v-on:submit.prevent="existingRoom">
            <label for="key">Join existing room: </label>
            <input type="text" id="key" name="key" autocomplete="off" placeholder="Room key" />
            <input type="submit" value="Join" />
        </form>
    </div>
    <button type="button" v-on:click="newRoom">Create new room</button>
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
</style>
