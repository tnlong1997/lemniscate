function reverseString(str) {
    return str.split("").reverse().join("");
}

export function beautifyNumber(str) {
    return reverseString([...reverseString(str)].map((s, i) => (i) % 3 == 0 ? ' ' + s : s).join('').trim())
}
