import * as ldap from 'ldapjs';

/**
 * This class represents an abstract model of a LDAP Client
 * which connects to an AD. Contains many methods useful
 * for a login.
 * 
 * @author Francisco Viola
 * @version 04.03.2021
 */

export class LDAPClient { 

  /**
   * The possible paths of the AD.
   */
  readonly possiblePaths: string[] = [
    "OU=docenti,DC=CPT,DC=local",
    "OU=1,OU=LC,OU=C,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=LC,OU=C,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=LC,OU=C,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=EM,OU=EM,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=EM,OU=EM,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=EM,OU=EM,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=EM,OU=EM,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=DA,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=DA,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=DA,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=DA,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=DEGC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=DEGC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=DEGC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=DEGC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=DI,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=DI,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=DI,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=DI,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=1,OU=DIC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=2,OU=DIC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=3,OU=DIC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
    "OU=4,OU=DIC,OU=DT,OU=SAM,OU=allievi,DC=CPT,DC=local",
  ];

  /**
   * The LDAP client.
   */
  client: ldap.Client = ldap.createClient({
    url: "ldap://sv-108-dc:389",
  });

  /**
   * The options for LDAP client.
   */
  opts = {
    attributes: ["cn", "ou"],
  };

  /**
   * The password used for the connection.
   */
  readonly pw: string = "password";

  /**
   * Method for initialize the LDAP comunication. Call it at 
   * the beginning of the requests.
   */
  public start(): Promise<void> { 
    return new Promise((resolve, reject) => {
      this.client.bind(
        "CN=nicola.ambrosetti,OU=3,OU=I,OU=IN,OU=SAM,OU=allievi,DC=CPT,DC=local",
        this.pw,
        function (error) {
          if (error) {
            console.log("Error while connecting");
            reject(error);
            return;
          } else {
            console.log("Connected!");
            resolve();
            return;
          }
        }
      );
    });
  }

  /**
   * Method for end LDAP requests. Call it 
   * at the end of the requests.
   */
  public end() { 
    this.client.unbind();
  }


  /**
   * Internal method.
   * Used for bind using Promises.
   * 
   * @param client the ldap client for the connection
   * @param path the user path
   * @param pw the password of the user
   */
  public _bind = async (client: ldap.Client, path: string, pw: string) => {
    return new Promise((resolve, reject) => {
      client.bind(
        path,
        pw,
        (error) => {
          if (error) {
            reject(error);
            return;
          } else {
            resolve(true);
            return;
          }
        }
      );
    });
  }

  /**
   * Search a path using LDAP in the ActiveDirectory and
   * returns if the path matches.
   * *
   * @param query the active active directory path
   * @param opts the options to be searched
   */
  public queryAD = async (query: string, opts) => {
    return new Promise((resolve, reject) => {
      //console.log(`input: ${query}`);
      this.client.search(query, opts, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        res.on("searchEntry", function (entry) {
          resolve(query);
          return;
        });
        res.on("searchReference", function (referral) {
          resolve(referral);
          return;
        });
        res.on("error", function (err) {
          reject(null);
          return;
        });
        res.on("end", function (result) {});
      });
    });
  };

  /**
   * Check if a name (username) exists in the AD forest.
   * If exists it will return the path, otherwise null.
   * 
   * @param name The username to be checked
   * @returns the path or null
   */
  public getUserPath = async (name: string) => {
    let opts = {};
    let out = null;
    //console.log(this.possiblePaths.length);
    
    for (let i = 0; i < this.possiblePaths.length; i++) {
      let cn = `CN=${name},`;
      let query = cn + this.possiblePaths[i];
      //console.log(query);
      
      try {
        out = await this.queryAD(query, opts);
        if (out == undefined) {
          out = null;
        }
      } catch (err) {
        //doesnt found
        out = null;
      }
      //found
      if (out != null) {
        return out;
      }
    }
  };

  /**
   * Checks the credentials entered as parameters, 
   * with the user's actual credentials within the ActiveDirectory
   * via an LDAP bind.
   * 
   * @returns
   * true - username and password matching
   * false - invalid username or password
   * 
   * @param username the name of the user
   * @param password the password of the user
   */
  public checkUserCredentials = async (nome: string, password: string) => {
  let userclient: ldap.Client;
  if (nome.trim() != '' && password.trim() != '') {
    //name and password existing
    userclient = ldap.createClient({
      url: "ldap://sv-108-dc:389",
    });
    
    let user = await this.getUserPath(nome);
    console.log("user: " + user)
    if (user != undefined) {
      //user exists in AD
      let __out;
      try {
        __out = await this._bind(userclient, user, password);
      } catch (err) {
        //console.log(3);
        userclient.unbind();
        return false;
      }
      userclient.unbind();
      return __out;
    }else {
      userclient.unbind();
      return false;
    }
  }else {
    //username or password equals ""
    return false;
  }
};
}
