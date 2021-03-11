import { LDAPClient } from "./LDAPClient";

let ldap = new LDAPClient();
let nome: string = "nicola.ambrosetti";
let password: string = "";

const main = async () => {
  
  await ldap.start();
  let check = await ldap.checkUserCredentials(nome, password);
  
  console.log(check);
  
  ldap.end();
};

main();