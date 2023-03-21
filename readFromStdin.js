function readFromStdin() {
    return new Promise((ok,refuse)=>{
        var textArray = [];
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', e => {
            while ((chunk = process.stdin.read()) !== null) {
                textArray.push(chunk)
            }

        });
        process.stdin.on('end', () => {
            ok(textArray.join(''))
        });
    });
}

exports.readFromStdin = readFromStdin;