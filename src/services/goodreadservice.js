const debug = require('debug')('app:goodReadService');
const axios = require('axios');
const xmlToJs = require('xml2js');

function goodReadService() {
    function getBookDetailsByBookId(bookId) {
        const parser = xmlToJs.Parser({ explicitArray: false });
        debug('In getBookDetailsByBookId');
        return new Promise((resolve, reject) => {            
            axios.get(`https://www.goodreads.com/book/show/${bookId}.xml?key=LB7pUMj5V3qrySRaqmbbQ`)
                .then((response) => {
                    parser.parseString(response.data, (err, result) => {
                        if (err) {
                            debug(err);
                            reject(err);
                        } else {                            
                            resolve({ bookDetail: result.GoodreadsResponse.book });
                        }
                    });
                })
                .catch((error) => {
                    debug(error);
                    reject(error);
                });
        });
    }

    return {
        getBookDetailsByBookId
    };
}

module.exports = goodReadService;
