# Grades Manager

Front end of the project. Uses the REST API.

## Contributors

- Ambrosetti Nicola
- Trentin Ismael

## Changelog

### `v0.1.1`

#### Notes

**Home Page**

- The home page is now rendered based on the user type.
- Welcome message changes based on gender and time of the day

### `v0.1.0`

#### Notes

**Home Page**

- Added charts
- Added subjects search bar

**Login Page**

- Now works with school LDAP

**Authors Page**

- Checkout the project authors

**Teacher Page**

- Dedicated page for teachers. Search for your students and checkout their dashboards.

**Subject Page**

- See a more detailed overview of a specific subject, add grades, delete grades and edit them.

**Admin Page**

- Created page structure, logicless

**Subjects**

- Added a new menu option to directly open the Subject Page.

#### Fixes

- Charts update:

  - Now updates only when needed
  - Fixed a bug that displayed the old chart when overing with the mouse cursor

#### Bugs

- Subjects will not update correctly and still display deleted grades
- Subjects will not update correctly and still display the old teacher when changing it
- When setting a registered teacher to a subject, that subject wont be able to have an unregistered teacher anymore
- Cannot access Subjects Pages from the Nav outside from Home Page

### `v0.0.2`

**Home Page**

- Grades can now be **added** and **removed**.
- Subjects can now be **edited**.
- When an unkown teacher name is used, a warning appears
  and the user can get a list of all the available teachers. Otherwise, if the teacher is registered, the warning is not shown.
- **Fixed** subjects removal.

**Grade Prompt**

- When adding a new grade a prompt appears and you can insert the value, weight and date.

### `v0.0.1`

**Login Page**

- Existing but logicless.

**Home Page**

- Welcome message with the user's name.
- Persistent subjects data.
- Subjects can now be **added**.
- Subjects can now be **removed**.
- Subjects are also listed to the left.
- Clicking on a left list subject open it's details page (Subject Page) [**broken**].

**Subject Page**

- Basic page structure
