function parseCode(content) {
    const functionNames = content.match(/function\s+(\w+)/g) || [];
    return functionNames.map(fn => `- ${fn}`).join('\n') + '\n\n';
}

module.exports = {
    parseCode
};
