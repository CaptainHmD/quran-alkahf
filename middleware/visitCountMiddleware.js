const fs = require('fs');
const path = require('path');

const visitCountFilePath = path.join(__dirname, '..', 'visit_count.txt');

function visitCountMiddleware(req, res, next) {
    fs.readFile(visitCountFilePath, 'utf8', (err, data) => {
        if (err) {
            fs.writeFile(visitCountFilePath, '1', () => {});
        } else {
            const count = parseInt(data) + 1;
            fs.writeFile(visitCountFilePath, count.toString(), () => {});
        }
        next();
    });
}

module.exports = visitCountMiddleware;
