let database = null;

export default class FB {
  static init() {
    const config = {
      apiKey: 'AIzaSyDFqeomnCXYFfuIj3iSf5NpHBgRDUXGB4k',
      authDomain: "tripflow-1509338122882.firebaseapp.com",
      databaseURL: 'https://tripflow-1509338122882.firebaseio.com/',
    };
    firebase.initializeApp(config);
    database = firebase.database();
    console.log('firebase initialized...');
  }

  static readDB(path) {
    return database.ref(path).once('value')
  }
  
  static writeDB(path, value) {
    return database.ref(path).set(value)
  }
}
