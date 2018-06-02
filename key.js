const licenseFile = require('nodejs-license-file');
const os = require('os');
const winston = require('./winston')

const template = [
    '{{&licenseVersion}}',
    '{{&applicationVersion}}',
    '{{&companyName}}',
    '{{&macAdress}}',
    '{{&date}}',
    '{{&serial}}'
].join('\n');

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA9tLQImJH0Jf6KV2V2GBp
DltMaKc2wMt2jJATCC6GK30J0kuK2nnpdVwlONdYZdk/z0oJ3IBdlUbXTu9shVkr
WvxA04PRvyBonjc/iuE24cXlQiip3/m82v5KhALYy04wvNIqgCp3mlkWafm8wDTJ
0OiVCkXIJT+iepPxyh29fj9UGKPBARbN+g8tgCBGJRm6ComiVBFCMf/mxUEc8VjF
dvI+CR4lout/jHk3xmCluOVE95wFBtyonyxfL6udIA1RfJawQ1ilSJNNm+XjXNwH
orUpRur0ME5v1djOKm9guu/WDmoLQ2+vMt4IM/n6WTuiyv29MPA247A/oaFrHJVU
sQIDAQAB
-----END PUBLIC KEY-----`

function CheckLicense() {
    try {

        const data = licenseFile.parse({
            publicKey: publicKey,
            licenseFilePath: 'license',
            template
        });

        var licenseMac = data.data.macAdress.toLowerCase();
        var localMac = os.networkInterfaces().Ethernet[0].mac.replace(/:/g, "-");

        winston.info(data);

        if (licenseMac == localMac) {
            return
        } else {
            process.exit();
        }

    } catch (err) {
        winston.error(err);
        process.exit();
    }
}

module.exports = {
    CheckLicense: CheckLicense
}