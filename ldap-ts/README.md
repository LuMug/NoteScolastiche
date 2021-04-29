# LDAP-TS

Setup a LDAP connection, binding, and check credentials from an AD. Used in [GMAPI](https://github.com/LuMug/NoteScolastiche/tree/main/gmapi).
Uses [LDAPJS](http://ldapjs.org/) library.

## Contributors

- Francisco Viola
- Aris Previtali

## Changelog

### v0.0.2

**LDAPClient:**

- **Fixed** security issues

### v0.0.1

**PathParser**

- Now LDAP string can be parsed

**ADUser**

- Created basic AD User structure

**LDAPClient:**

- You can now check to see if your login credentials match those of the AD Forest.

- Now can check if a name exists in AD forest.

- Added first binding method

- Created LDAPClient basic structure