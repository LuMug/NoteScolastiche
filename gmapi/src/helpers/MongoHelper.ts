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
			withUID.uid = await this.getNextUIDFor(collName);
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
		return this.is<ITeacher>(input, { name: '', subjectsIds: [], surname: '' });
	}

	/**
	 * Returns `true` if `input` is a valid `ISubject` object,
	 * `false` otherwise.
	 * 
	 * @param input the object input
	 */
	// public static isSubject(input: any): boolean {
	//     return this.is<ISubject>(input, { name: '', teacherId: -1 });
	// }

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
	 * Returns the subjects collection.
	 */
	// public static getSubjects(): Collection<ISubject> {
	//     return this.getCollection('subjects');
	// }

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

	/**
	 * Returns the subject with uid `uid`.
	 * 
	 * @param uid the subject unique id
	 */
	// public static async getSubject(uid: number): Promise<ISubject | null> {
	//     return new Promise<ISubject | null>(async (resolve, reject) => {
	//         try {
	//             resolve(await this.getSubjects().findOne({ uid: uid }));
	//             return;
	//         } catch (err) {
	//             reject(err);
	//             return;
	//         }
	//     });
	// }

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
			try {
				resolve(await this.getUsers().findOne({ name: name, surname: surname }));
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
	 * Returns a subject by its name.
	 * 
	 * @param name the subject name
	 */
	// public static async getSubjectByName(name: string): Promise<ISubject | null> {
	//     return new Promise<ISubject | null>(async (resolve, reject) => {
	//         try {
	//             resolve(await this.getSubjects().findOne({ name: name }));
	//             return;
	//         } catch (err) {
	//             reject(err);
	//             return;
	//         }
	//     });
	// }

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
	public static async getNextUIDFor(collection: Collections): Promise<number> {
		return new Promise<number>(async (resolve, reject) => {
			let coll: Collection<CollectionTypes> = this.getCollection(collection);
			try {
				resolve(await coll.countDocuments({}));
			} catch (err) {
				reject(err);
				return;
			}
		});
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
	 * Adds a new subject to the subjects collection. It automatically
	 * handles the `uid` value increase.
	 * 
	 * @param subject the new subject to be added
	 */
	// public static async addSubject(subject: Omit<ISubject, 'uid'>): Promise<void> {
	//     return new Promise<void>(async (resolve, reject) => {
	//         try {
	//             await this.add<ISubject>('subjects', subject);
	//         } catch (err) {
	//             reject(err);
	//             return;
	//         }
	//         resolve();
	//         return;
	//     });
	// }

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

	public static async addGrade(userId: number, subjectId: number, grade: IGrade): Promise<void> {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find an user with uid ${userId}`);
					return;
				}
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

	public static async updateGrade(userId: number, subjectId: number, gradeId: number, grade: IGrade) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				let user: IUser | null = await this.getUser(userId);
				if (!user) {
					reject(`Could not find an user with uid ${userId}`);
					return;
				}
				user.subjects[subjectId].grades[gradeId] = grade;
				await this.updateUser(userId, { subjects: user.subjects });
			} catch (err) {
				reject(err);
				return;
			}
			resolve();
			return;
		});
	}

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
	 * Updates the subject by its `uid` with the given `subjectData` data.
	 * 
	 * @param uid the uid of the subject that needs to be updated
	 * @param subjectData the new data
	 */
	// public static async updateSubject(uid: number, subjectData: Partial<Omit<ISubject, 'uid'>>): Promise<void> {
	//     return new Promise<void>(async (resolve, reject) => {
	//         try {
	//             await this.update<ISubject>('subjects', uid, subjectData);
	//         } catch (err) {
	//             reject(err);
	//             return;
	//         }
	//         resolve();
	//         return;
	//     });
	// }

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