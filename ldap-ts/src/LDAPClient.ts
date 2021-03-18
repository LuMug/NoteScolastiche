import * as ldap from 'ldapjs';
import { ILdapOptions } from './ILdapOptions';
/**
 * This class represents an abstract model of a LDAP Client
 * which connects to an AD. Contains many methods useful
 * for a login.
 * 
 * @author Francisco Viola
 * @version 04.03.2021
 */

export class LDAPClient {

  private bindPath: string;

  private bindPw: string;

  private possiblePaths: string[];

  private bindURL: string;

  private client: ldap.Client;

  private opts: ldap.SearchOptions;

  constructor(options: ILdapOptions) {
    this.bindPath = options.bindPath;
    this.bindPw = options.bindPw;
    this.possiblePaths = options.possiblePaths;
    this.bindURL = options.bindURL;
    this.client = ldap.createClient({
      url: this.bindURL
    });
    this.opts = {
      attributes: ["cn", "ou"],
    };
  }

  /**
   * Method for initialize the LDAP comunication. Call it at 
   * the beginning of the requests.
   */
  public start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client.bind(
        this.bindPath,
        this.bindPw,
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
    return new Promise<boolean>((resolve, reject) => {
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
  public queryAD = async (query: string, opts: ldap.SearchOptions) => {
    return new Promise<string>((resolve, reject) => {
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
        res.on("end", function (result) { });
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
        url: this.bindURL,
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
      } else {
        userclient.unbind();
        return false;
      }
    } else {
      //username or password equals ""
      return false;
    }
<<<<<<< HEAD
  };
}
=======
  }else {
    //username or password equals ""
    return false;
  }
};
}
>>>>>>> 25e4d13e3c19d5590efa3046f030b5fac36039be