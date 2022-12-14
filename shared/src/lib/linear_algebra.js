// linear algebra functions
function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y }
}
function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y }
}
function mul(a, k) {
    return { x: a.x * k, y: a.y * k }
}
function zero() {
    return { x: 0, y: 0 }
}
function magnitude(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y)
}
function normalize(a) {
    let angle = Math.atan2(a.y, a.x)
    return { x: Math.cos(angle), y: Math.sin(angle) }
}
function clip(x, l, r) {
    return Math.max(l, Math.min(r, x))
}

// random functions
function randomFloat(l, r) {
    return Math.random() * (r - l) + l
}

function randomInt(l, r) {
    return ~~(randomFloat(l, r))
}

function randomExp(l, r) {
    return Math.exp(randomFloat(Math.log(l), Math.log(r)))
}

function randomColor() {
    var letters = "0123456789ABCDEF"
    var color = "#"
    for (var i = 0; i < 6; i++) {
        color += letters[~~(Math.random() * 16)]
    }
    return color
}

function pickRandom(arr) {
    return arr[randomInt(0, arr.length)]
}

module.exports = {
    add, sub, mul, zero, magnitude, normalize, clip,
    randomFloat, randomInt, randomExp, randomColor, pickRandom,
}