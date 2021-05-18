export const database = firebase.firestore();

export const teaBase = database.collection("tea");
export const commentsBase = database.collection("comments");

export const auth = firebase.auth();
export const storage = firebase.storage().ref();