const defaultValues = require('./config');

function setting(key, defaultVal) {
    return process.env[key] || defaultVal;
}

let calculatedValues = {};
Object.keys(defaultValues).forEach((key) => {
    let processVal = process.env[key];
    if (processVal) {
        console.log(`Found value for environment var '${key}`);
        console.log(`  ${processVal}`);

        calculatedValues[key] = processVal;
        return;
    }

    calculatedValues[key] = defaultValues[key];
});

module.exports = {
    config: calculatedValues
};