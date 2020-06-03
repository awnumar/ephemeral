<template>
  <div class="content">
    <h1 class="title">Ephemeral</h1>
    <div class="form">
        <form>
            <label for="key">Join existing room: </label>
            <input type="text" id="id" name="id" autocomplete="off" placeholder="Room key" /><br /><br />
            <input type="submit" value="Join" />
        </form>
    </div>
    <br /><br />
    <button type="button">Create new room</button>
  </div>
</template>

<script>
export default {};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
