function bytesToHex(bytes) {
    // https://stackoverflow.com/a/34356351
    for (let hex = [], i = 0; i < bytes.length; i++) {
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
