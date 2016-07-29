const DIR_NAME = 'c://Users//Pavilion//Music//';
const NEW_DIR_NAME = 'c://Music//';
var fs = require('fs');

function copyFiles(sourceDir, destinationDir, files) {
    if (files.length == 0) {
        return;
    }
    fs.readFile(sourceDir + files[0], function (err, data) {
        if (err) throw err;
        console.log('read ' + files[0]);
        fs.writeFile(destinationDir + files[0], data, function (err) {
            console.log('wrote ' + files[0]);
            if (err) throw err;
            files.splice(0, 1);
            copyFiles(sourceDir, destinationDir, files);
        });
    });
}

fs.readdir(DIR_NAME, function (err, files) {
    if (err) throw err;
    copyFiles(DIR_NAME, NEW_DIR_NAME, files);
});
