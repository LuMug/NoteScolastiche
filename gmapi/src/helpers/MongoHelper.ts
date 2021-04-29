import mongonnect from './Mongonnect';
import { Collection, MongoClient } from 'mongodb';
import {
	Collections,
	CollectionTypes,
	IGrade,
	IGroup,
	ITeacher,
	IUser,
	IUserSubject,
	UserType
} from '../@types';
import { sha256 } from 'js-sha256';

const DB_NAME: string = 'gradesmanager';

/**
 * Mongodb package helper.
 * A connection needs to be enstablished before using it,
 * use MongoHelper.connect().
 * 
 * @author Ismael Trentin
 * @author Aris Previtali
 * @version 2020.02.04
 */
export class MongoHelper {

	/**
	 * The mongodb client connection instance.
	 */
	private static client: MongoClient;

	/**
	 * Returns the collection `name` object.
	 * 
	 * @param name the collection's `name`
	 * @param dbName the db name
	 */
	private static getCollection(name: Collections): Collection<any> {
		return this.client.db(DB_NAME).collection(name);
	}

	/**
	 * Fetches the collection from the db and returns ir as an array.
	 * 
	 * @param name the collection name.
	 */
	private static async fetchAsArray<T extends CollectionTypes>(name: Collections) {
		let coll: Collection<T> = this.getCollection(name);
		return await coll.find({}).toArray();
	}

	private static is<T extends CollectionTypes | IUserSubject | IGrade = IUser>(input: any, model: Omit<T, 'uid'>): boolean {
		if (input == null) {
			return false;
		}
		let ks: string[] = Object.keys(input);
		let modelKs: string[] = Object.keys(model);//.filter(e => e != 'uid')
		if (ks.length != modelKs.length) {
			return false;
		}
		ks = ks.sort(function (a, b) {
			if (a < b) { return -1; }
			if (a > b) { return 1; }
			return 0;
		});
		modelKs = modelKs.sort(function (a, b) {
			if (a < b) { return -1; }
			if (a > b) { return 1; }
			return 0;
		});
		let out: boolean = true;
		modelKs.map((k, i) => {
			if (k != ks[i]) {
				out = false;
				return;
			}
		});
		return out;
	}

	private static async add<T extends CollectionTypes = IUser>(collName: Collections, data: Omit<T, 'uid'>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			let withUID: T = Object.assign({}, data as unknown as T);
			if ((withUID as any).surname) {
				withUID.uid = this.getUUID(`${withUID.name}.${(withUID as any).surname}`);
			} else {
				withUID.uid = this.getUUID(withUID.name);
			}
			try {
				await this.getCollection(collName).insertOne(withUID);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	private static async update<T extends CollectionTypes>(collName: Collections, uid: number, data: Partial<Omit<T, 'uid'>>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			if (data == null) {
				reject('Data cannot be null');
				return;
			}
			if (Object.keys(data).length == 0) {
				reject(`Invalid data. Cannot be an empty object`);
				return;
			}
			let coll = this.getCollection(collName);
			if (!await coll.findOne({ uid: uid })) {
				reject(`No document with uid ${uid} found in ${collName} `);
				return;
			}
			try {
				await this.getCollection(collName).findOneAndUpdate(
					{ uid: uid },
					{ $set: data },
					{ upsert: true }
				);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Returns the given collection as an array;
	 * 
	 * @param collection the given collection
	 */
	public static async asArray<T extends CollectionTypes>(collection: Collection<T>) {
		return await collection.find({}).toArray();
	}

	/**
	 * Connects to a mongodb database and instantiates
	 * a new client connection;
	 */
	public static async connect() {
		this.client = await mongonnect();
		return this.client;
	}

	/**
	 * Returns `true` if `input` is a valid `IUser` object,
	 * `false` otherwise.
	 * 
	 * @param input the object input
	 */
	public static isUser(input: any): boolean {
		return this.is(input, { name: '', groupId: -1, subjects: [], surname: '', type: UserType.STUDENT });
	}

	/**
	 * Returns `true` if `input` is a valid `ITeacher` object,
	 * `false` otherwise.
	 * 
	 * @param input the object input
	 */
	public static isTeacher(input: any): boolean {
		return this.is<ITeacher>(input, { name: '', subjectsIds: [], surname: '', groupsIds: [] });
	}

	/**
	 * Returns `true` if `input` is a valid `IGroup` object,
	 * `false` otherwise.
	 * 
	 * @param input the object input
	 */
	public static isGroup(input: any): boolean {
		return this.is<IGroup>(input, { name: '' });
	}

	public static isUserSubject(input: any): boolean {
		return this.is<IUserSubject>(input, { teacherName: '', grades: [], name: '' });
	}

	public static isGrade(input: any): boolean {
		return this.is<IGrade>(input, { value: -1, date: "", weight: -1 });
	}

	/**
	 * Returns the users collection.
	 */
	public static getUsers(): Collection<IUser> {
		return this.getCollection('users');
	}

	/**
	 * Returns the teachers collection.
	 */
	public static getTeachers(): Collection<ITeacher> {
		return this.getCollection('teachers');
	}

	/**
	 * Returns the groups collection.
	 */
	public static getGroups(): Collection<IGroup> {
		return this.getCollection('groups');
	}

	/**
	 * Returns the user with uid `uid` or returns null.
	 * 
	 * @param uid the user unique id
	 */
	public static async getUser(uid: number): Promise<IUser | null> {
		return new Promise<IUser | null>(async (resolve, reject) => {
			try {
				let data = await this.getUsers().findOne({ uid: uid });
				if (data) {
					delete (data as any)._id;
				} else {
					console.error(`Illegal fetch: No user with uid: ${uid}`);
				}
				resolve(data);
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	/**
	 * Returs the teacher with uid `uid`.
	 * 
	 * @param uid the teacher unique id
	 */
	public static async getTeacher(uid: number): Promise<ITeacher | null> {
		return new Promise<ITeacher | null>(async (resolve, reject) => {
			try {
				resolve(await this.getTeachers().findOne({ uid: uid }));
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	public static async getStudents() {
		let users = await this.asArray(this.getUsers());
		return users.filter(v => v.type == UserType.STUDENT);
	}

	/**
	 * Returns the group with the unique id `uid`.
	 * 
	 * @param uid the group unique id
	 */
	public static async getGroup(uid: number): Promise<IGroup | null> {
		return new Promise<IGroup | null>(async (resolve, reject) => {
			try {
				resolve(await this.getGroups().findOne({ uid: uid }));
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	/**
	 * Returs the user object with name `name` and surname `surname`.
	 * 
	 * @param name the user name
	 * @param surname the user surname
	 */
	public static async getUserByFullName(name: string, surname: string): Promise<IUser | null> {
		return new Promise<IUser | null>(async (resolve, reject) => {
			let nameExp = new RegExp(name, 'i');
			let surnameExp = new RegExp(surname, 'i');
			try {
				resolve(await this.getUsers().findOne({
					name: { $regex: nameExp },
					surname: { $regex: surnameExp }
				}));
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	/**
	* Returs the teacher object with name `name` and surname `surname`.
	* 
	* @param name the user name
	* @param surname the user surname
	*/
	public static async getTeacherByFullName(name: string, surname: string): Promise<ITeacher | null> {
		return new Promise<ITeacher | null>(async (resolve, reject) => {
			try {
				resolve(await this.getTeachers().findOne({ name: name, surname: surname }));
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	/**
	 * Returns the group by its name.
	 * 
	 * @param name the group name
	 */
	public static async getGroupByName(name: string): Promise<IGroup | null> {
		return new Promise<IGroup | null>(async (resolve, reject) => {
			try {
				resolve(await this.getGroups().findOne({ name: name }));
				return;
			} catch (err) {
				reject(err);
				return;
			}
		});
	}

	/**
	 * Returns the next available uid for a specific collection.
	 * Mimics the SQL auto_increment.
	 * 
	 * @param collection the collection from wich to get the value
	 */
	public static getUUID(username: string): number {
		let hash = sha256(username);
		let len = hash.length / 2;
		let sum = 0;
		for (let i = 0; i < len; i++) {
			sum += parseInt(hash.substr(i * 2, 2), 16);
		}
		return sum;
	}

	/**
	 * Adds a new user to the users collection. It automatically
	 * handles the `uid` value increase.
	 * 
	 * @param user the new user to be added
	 */
	public static async addUser(user: Omit<IUser, 'uid'>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.add<IUser>('users', user);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Adds a new teacher to the teachers collections. It automatically
	 * handles the `uid` value increase.
	 * 
	 * @param teacher the new teacher to be added
	 */
	public static async addTeacher(teacher: Omit<ITeacher, 'uid'>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.add<ITeacher>('teachers', teacher);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Adds a new group to the groups collection. It automatically
	 * handles the `uid` value increase.
	 * 
	 * @param group the new group to be added
	 */
	public static async addGroup(group: Omit<IGroup, 'uid'>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.add<IGroup>('groups', group);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Adds a new subject id to the teacher.
	 * 
	 * @param teacherUID the unique id of the teacher
	 * @param ids the ids of the subjects
	 */
	public static async addSubjectId(teacherUID: number, ...ids: number[]): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let teacher: ITeacher | null = await this.getTeacher(teacherUID);
				if (!teacher) {
					reject(`Could not find a teacher with uid ${teacherUID}`);
					return;
				}
				teacher.subjectsIds = teacher.subjectsIds.concat(ids);
				await this.updateTeacher(teacherUID, { subjectsIds: teacher.subjectsIds });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Adds a new subject to a user.
	 * 
	 * @param userId the unique id of the user
	 * @param subject the IUserSubject
	 */
	public static async addUserSubject(userId: number, subject: IUserSubject): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find a teacher with uid ${userId}`);
					return;
				}
				user.subjects = user.subjects.concat(subject);
				await this.updateUser(userId, { subjects: user.subjects });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Adds a new grade to a user.
	 * 
	 * @param userId the unique id of the user
	 * @param subjectId the unique id of the subject
	 * @param grade the IGrade
	 */
	public static async addGrade(userId: number, subjectId: number, grade: IGrade): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find an user with uid ${userId}`);
					return;
				}
				if (user.subjects.length == 0) {
					reject(`User has no subjects`);
					return;
				}
				if (!user.subjects[subjectId]) {
					reject(`User has no subject with id ${subjectId}`);
					return;
				}
				if (!grade.date || grade.date.trim() === "") {
					grade.date = new Date().toISOString();
				}
				let subject = user.subjects[subjectId];
				user.subjects[subjectId].grades.push(grade);
				await this.updateUser(userId, { subjects: user.subjects });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Updates a user's grade
	 * 
	 * @param userId the unique id of the user
	 * @param subjectId the unique id of the subject
	 * @param gradeId the unique id of the grade
	 * @param grade the updated IGrade
	 */
	public static async updateGrade(userId: number, subjectId: number, gradeId: number, grade: Partial<IGrade>) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find an user with uid ${userId}`);
					return;
				}
				if (user.subjects.length == 0) {
					reject(`User has no subjects`);
					return;
				}
				if (!user.subjects[subjectId]) {
					reject(`User has no subject with id ${subjectId}`);
					return;
				}
				let subject = user.subjects[subjectId];
				if (subject.grades.length == 0) {
					reject(`User has no grades for subjects ${subject.name}`);
					return;
				}
				let oldGrade = user.subjects[subjectId].grades[gradeId];
				if (grade.date) {
					oldGrade.date = grade.date;
				}
				if (grade.weight) {
					oldGrade.weight = grade.weight;
				}
				if (grade.value) {
					oldGrade.value = grade.value;
				}

				user.subjects[subjectId].grades[gradeId] = oldGrade;
				await this.updateUser(userId, { subjects: user.subjects });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Updates a user's subject.
	 * 
	 * @param userId the unique id of the user
	 * @param subject the updates IUserSubject 
	 * @param subjectIndex the subject's index in the user's array
	 */
	public static async updateUserSubject(userId: number, subject: IUserSubject, subjectIndex: number): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find a user with uid ${userId}`);
					return;
				};

				let teacher;
				if (subject.teacherId && (!subject.teacherName || subject.teacherName.trim() == '')) {
					teacher = await MongoHelper.getTeacher(subject.teacherId);
					if (teacher) {
						subject.teacherName = `${teacher?.surname} ${teacher?.name}`;
					} else {
						subject.teacherName = `???`;
					}
				}
				if (!subject.teacherId && subject.teacherName && subject.teacherName.trim() != '') {
					let fullname = subject.teacherName.split(' ');
					teacher = await MongoHelper.getTeacherByFullName(fullname[1], fullname[0]);
					if (teacher) {
						subject.teacherName = `${teacher.surname} ${teacher.name}`;
						subject.teacherId = teacher.uid;
					} else {
						teacher = await MongoHelper.getTeacherByFullName(fullname[0], fullname[1]);
						if (teacher) {
							subject.teacherName = `${teacher.surname} ${teacher.name}`;
							subject.teacherId = teacher.uid;
						} else {
							delete subject.teacherId;
						}
					}
				}

				user.subjects[subjectIndex] = subject;
				await this.updateUser(userId, { subjects: user.subjects });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Updates the user by its `uid` with the given `userData` data.
	 * 
	 * @param uid the uid of the user that needs to be updated
	 * @param userData the new data
	 */
	public static async updateUser(uid: number, userData: Partial<Omit<IUser, 'uid'>>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.update<IUser>('users', uid, userData);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Updates the teacher by its `uid` with the given `teacherData` data.
	 * 
	 * @param uid the uid of the teacher that needs to be updated
	 * @param teacherData the new data
	 */
	public static async updateTeacher(uid: number, teacherData: Partial<Omit<ITeacher, 'uid'>>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.update<ITeacher>('teachers', uid, teacherData);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Updates the group by its `uid` with the given `groupData` data.
	 * 
	 * @param uid the uid of the group that needs to be updated
	 * @param groupData the new data
	 */
	public static async updateGroup(uid: number, groupData: Partial<Omit<IGroup, 'uid'>>): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				await this.update<IGroup>('groups', uid, groupData);
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

	/**
	 * Removes a grade from a user's subject
	 * 
	 * @param uuid the unique id of the user
	 * @param sIndex the subject's index of the user's array
	 * @param gIndex the grade's index of the user's array
	 */
	public static async removeGrade(uuid: number, sIndex: number, gIndex: number) {
		let user;
		try {
			user = await this.getUser(uuid);
			if (!user) {
				throw 'Invalid user uid';
			}
			user.subjects[sIndex].grades.splice(gIndex, 1);
			await this.updateUser(uuid, user);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Removes a user.
	 * 
	 * @param uid the unique id of the user
	 */
	public static async removeUser(uid: number) {
		let user;
		try {
			user = await this.getUser(uid);
			if (!user) {
				throw 'Invalid user id';
			}
			this.getUsers().deleteOne({ uid: uid });
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Removes a teacher.
	 * 
	 * @param uid unique id of the teacher
	 */
	public static async removeTeacher(uid: number) {
		let user;
		try {
			user = await this.getTeacher(uid);
			if (!user) {
				throw 'Invalid user id';
			}
			this.getTeachers().deleteOne({ uid: uid });
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Removes a UserSubject.
	 * 
	 * @param uid the unique id of the user
	 * @param suid the unique id of the subject
	 */
	public static async removeUserSubject(uid: number, suid: number) {
		let user;
		try {
			user = await this.getUser(uid);
			if (!user) {
				throw 'Invalid user id';
			}
			let sName = user.subjects[suid].name;
			this.getUsers().updateOne({}, { $pull: { subjects: { 'name': 'Progetti' } } })
		} catch (err) {
			throw (err);
		}
	}
}