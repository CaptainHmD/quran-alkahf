const fs = require('fs');
const path = require('path');

const visitCountFilePath = path.join(__dirname, '..', 'visit_count.txt');
const backupFilePath = path.join(__dirname, '..', 'visit_count_backup.txt');

function readCountFile(callback) {
    fs.readFile(visitCountFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        // Trim whitespace and parse
        const trimmedData = data.trim();
        const count = parseInt(trimmedData);
        if (isNaN(count)) {
            return callback(new Error('Invalid count data'));
        }
        callback(null, count);
    });
}

function writeCountFile(count, callback) {
    fs.writeFile(visitCountFilePath, count.toString(), callback);
}

function backupCountFile(count, callback) {
    fs.writeFile(backupFilePath, count.toString(), callback);
}

function readBackupFile(callback) {
    fs.readFile(backupFilePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        // Trim whitespace and parse
        const trimmedData = data.trim();
        const count = parseInt(trimmedData);
        if (isNaN(count)) {
            return callback(new Error('Invalid backup data'));
        }
        callback(null, count);
    });
}

function resetCount(callback) {
    const defaultCount = 0;
    writeCountFile(defaultCount, callback);
}

function visitCountMiddleware(req, res, next) {
    readCountFile((err, count) => {
        if (err) {
            console.log('Error reading visit count file:', err);
            readBackupFile((backupErr, backupCount) => {
                if (backupErr) {
                    console.log('Error reading backup file:', backupErr);
                    resetCount(() => {
                        next();
                    });
                } else {
                    writeCountFile(backupCount, (writeErr) => {
                        if (writeErr) {
                            console.log('Error writing visit count file:', writeErr);
                        }
                        next();
                    });
                }
            });
        } else {
            count++; // Increment the count
            writeCountFile(count, (writeErr) => {
                if (writeErr) {
                    console.log('Error writing visit count file:', writeErr);
                } else {
                    backupCountFile(count, (backupErr) => {
                        if (backupErr) {
                            console.log('Error writing backup file:', backupErr);
                            resetCount(() => {
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                }
            });
        }
    });
}

module.exports = visitCountMiddleware;
