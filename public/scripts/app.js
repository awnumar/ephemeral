const NotFound = { template : "<p>Page not found</p>" }

const Home = { template : `<div>
    <h1 class="title">Ephemeral</h1>
    <div class="form">
        <form>
            <label for="key">Join existing room: </label>
            <input type="text" id="id" name="id" autocomplete="off" placeholder="Room key" /><br /><br />
            <input type="submit" value="Join" />
        </form>
    </div>
    <br /><br />
    <button type="button" onclick="new_room()">Create new room</button>
</div>`}

const Chat = { template : `<div>
    <h1 class="title">Ephemeral</h1>
    <p>this is the chat window</p>
</div>`}

const routes = {
    "/": Home,
    "/#/chat": Chat
}

new Vue({
    el: "#app",
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound;
        }
    },
    render (h) { return h(this.ViewComponent); }
})

// Crypto related code

let key = [];
let room_id = "";

function bytesToHex(bytes) {
    // https://stackoverflow.com/a/34356351
    let hex = [];
    for (hex = [], i = 0; i < bytes.length; i++) {
        let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }
    return hex.join("");
}

function new_room() {
    key = nacl.randomBytes(32);
    room_id = nacl.hash(key).slice(0, 32);
    document.location.href = "/#/chat";
}
