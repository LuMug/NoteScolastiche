"use strict";
/**
 * @author Francisco Viola
 * @version 04.03.2021
 */
exports.__esModule = true;
var ldap = require("ldapjs");
var ADUser_1 = require("./ADUser");
var pw = "Baloo-2003";
var client = ldap.createClient({
    url: 'ldap://sv-108-dc:389'
});
var opts = {
    attributes: ['cn', 'ou']
};
/*function start() {
  client.bind('CN=nicola.ambrosetti,OU=3,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local', pw, function (error) {
    if (error) {
      console.log("Error while connecting");
    } else {
      console.log("Connected!");
    }
  });
}*/
//CN=francisco.viola,OU=3,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local
// nome, cognome, 
function getUserInfo(path) {
    var parts = path.split(',');
    var userName = '';
    var userSurname = '';
    var userSection = '';
    var userClass = '';
    var userYear = '';
    if (parts.length == 8) {
        userName = parts[0].split('=')[1].split(".")[0];
        userSurname = parts[0].split(".")[1];
        userSection = parts[3].split("=")[1];
        userClass = parts[2].split("=")[1];
        userYear = parts[1].split("=")[1];
        return JSON.stringify(new ADUser_1.ADUser(userName, userSurname, userSection, userClass, userYear));
    }
    else {
        userName = parts[0].split(".")[0];
        userSurname = parts[0].split(".")[1];
        return JSON.stringify(new ADUser_1.ADUser(userName, userSurname));
    }
}
var test = getUserInfo('CN=luca.muggiasca,OU=docenti,DC=CPT,DC=local');
console.log(test);
