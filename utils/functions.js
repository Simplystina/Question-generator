exports.hasNumbers = (str) => {
    return /\d/.test(str);
};
exports.checkSentence = (word) => {
    const splittedWord = word.split(' ')
    console.log(splittedWord, "splittedWord")
    if (splittedWord.length > 1) {
        return true
    } else {
        return false
    }
}