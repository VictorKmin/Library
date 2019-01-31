const MILLISECONDS_ID_DAY = require('../constants/values').MILLISECONDS_ID_DAY;
process.on('message', () => {
    setInterval(checkBooks, MILLISECONDS_ID_DAY);
});

async function checkBooks() {
    console.log('CHECK')
}