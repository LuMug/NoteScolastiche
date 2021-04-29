/**
 * This class represents an abstract model of a user from
 * the Active Directory.
 * 
 * @author Francisco Viola
 * @version 25.02.2021
 */

export class ADUser { 
  /**
   * The name. 
   */
  name: string;

  /**
   * The surname.
   */
  surname: string;

  /**
   * The school section.
   */
  section?: string;

  /**
   * The group.
   */
  group?: string;

  /**
   * The school year.
   */
  year?: number;


  constructor(name: string, surname: string, section?: string, group?: string, year?: string) {
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
}