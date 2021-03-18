"use strict";
/**
 * This class represents an abstract model of a user from
 * the Active Directory.
 *
 * @author Francisco Viola
 * @version 25.02.2021
 */
exports.__esModule = true;
exports.ADUser = void 0;
var ADUser = /** @class */ (function () {
    function ADUser(name, surname, section, group, year) {
        this.name = name;
        this.surname = surname;
        if (section) {
            this.section = section;
        }
        if (group) {
            this.group = group;
        }
        if (year) {
            this.year = parseInt(year);
        }
    }
    return ADUser;
}());
exports.ADUser = ADUser;
