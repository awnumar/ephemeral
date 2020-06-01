const NotFound = { template : "<p>Page not found</p>" }
const Home = { template : `
    <div class="content">
    <h1 class="title">Ephemeral</h1>
    <div class="form">
        <form action="/chat" method="get">
            <label for="key">Join existing room: </label>
            <input type="text" id="id" name="id" autocomplete="off" placeholder="Room key" /><br /><br />
            <input type="submit" value="Join" />
        </form>
    </div>
    <br /><br />
    <button type="button" onclick="new_room()">Create new room</button>
    </div>
`}
const Chat = { template : `

`}

const routes = {
    "/": Home,
    "/chat": Chat
}

new Vue({
    el: "#app",
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound
        }
    },
    render (h) { return h(this.ViewComponent); }
})

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
    window.location.href =
        "/chat?room=" + bytesToHex(nacl.hash(nacl.randomBytes(32)).slice(0, 32));
}
