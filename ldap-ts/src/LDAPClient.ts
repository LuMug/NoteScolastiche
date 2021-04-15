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

  /**
   * The user path used for the binding.
   */
  private bindPath: string;

  /**
   * The password used for the binding user.
   */
  private bindPw: string;

  /**
   * The list of possible user paths in the ActiveDirectory.
   */
  private possiblePaths: string[];

  /**
   * The ActiveDirectory bind url.
   * ex. ldap://ds.example.com:389
   */
  private bindURL: string;

  /**
   * The ldap client.
   */
  private client: ldap.Client;

  /**
   * The search options of the client.
   */
  private opts: ldap.SearchOptions;

  /**
   * 
   * @param options 
   */
  constructor(options: ILdapOptions) {
    this.bindPath = options.bindPath;
    this.bindPw = options.bindPw;
    this.possiblePaths = options.possiblePaths;
    this.bindURL = options.bindURL;
    this.opts = {
      attributes: ["cn", "ou"]
    };
    try {
      this.client = ldap.createClient({
        url: this.bindURL
      });
      this.client.on('error', e => { });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Method for initialize the LDAP comunication. Call it at 
   * the beginning of the requests.
   */
  public async start() {
    return new Promise<void>((resolve, reject) => {
      this.client.bind(
        this.bindPath,
        this.bindPw,
        e => {
          if (e) {
            console.error(e);
            reject('LDAP start error');
          } else {
            console.log("Connected!");
            resolve();
          }
        }
      );
    });
  }

  /**
   * Method for end LDAP requests. Call it 
   * at the end of the requests.
   */
  public async end() {
    return new Promise<void>((resolve, reject) => {
      this.client.unbind(e => {
        if (e) {
          reject(e);
          return;
        } else {
          resolve();
          return;
        }
      });
    });
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
        e => {
          if (e) {
            reject(e);
            return;
          } else {
            resolve(true);
            return;
          }
        }
      );
    });
  }

  public unbind = async (client: ldap.Client) => {
    return new Promise<void>((resolve, reject) => {
      client.unbind(e => {
        if (e) {
          reject(e);
          return;
        }
        resolve();
        return;
      });
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
        res.on("searchEntry", entry => {
          // entry????
          resolve(query);
          return;
        });
        res.on("searchReference", referral => {
          resolve(referral);
          return;
        });
        res.on("error", err => {
          reject(err);
          return;
        });
        res.on("end", result => { });
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
    let out;
    for (let i = 0; i < this.possiblePaths.length; i++) {
      let cn = `CN=${name},`;
      let query = cn + this.possiblePaths[i];
      try {
        out = await this.queryAD(query, opts);
      } catch (err) {
        console.error(err);
        return null;
      }
      if (out) {
        return out;
      }
    }
    return null;
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
      let user;
      userclient = ldap.createClient({
        url: this.bindURL,
      });
      try {
        user = await this.getUserPath(nome);
      } catch (err) {
        console.error(err);
        return false;
      }
      try {
        if (user) {
          //user exists in AD
          let __out;
          __out = await this._bind(userclient, user, password);
          await this.unbind(userclient);
          return __out;
        } else {
          await this.unbind(userclient);
          return false;
        }
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      //username or password equals ""
      return false;
    }
  };
}
