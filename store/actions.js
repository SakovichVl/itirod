import { store } from "../index.js"
import { addTeaButton, emailTitle, loginButton, logoutButton, signupButton } from "../mainElements.js"
import { commentsBase, storage, teaBase } from "./database.js"

export const INIT_ACTION_TYPE = 'INIT'

export const COMMENT_ACTION_TYPES = {
  GET_COMMENT: 'GET_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
}

export const TEA_ACTION_TYPES = {
  GET_TEA: 'GET_TEA',
  ADD_TEA: 'ADD_TEA',
  EDIT_TEA: 'EDIT_TEA',
  REMOVE_TEA: 'REMOVE_TEA',
}

export const AUTH_ACTION_TYPES = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
}

//// Tea Actions ////

export const getTeaAction = async () => {
  try {
    const querySnapshot = await teaBase.get()
    const data = {};

    querySnapshot.forEach(doc => {
      const teaData = doc.data()

      data[doc.id] = {
        ...teaData,
        createdDate: new Date(JSON.parse(teaData.createdDate)),
        teaId: doc.id
      }
    });

    store.dispatch({
      type: TEA_ACTION_TYPES.GET_TEA,
      payload: data
    })
  } catch ({ message }) {
    console.error(message)
  }  
}

export const addTeaAction = async (teaData) => {
  try {
    const { image, ...otherData } = teaData;

    if(!!image) {

      const imageRef = await storage.child(image.name).put(image);
      const imageURL = await imageRef.ref.getDownloadURL();

      otherData.imageURL = imageURL; 
    }

  
    const docRef = await teaBase.add(otherData);
    const doc = await docRef.get();

    if(!doc.exists) {
      return;
    }

    const data = doc.data();
    const { id: teaId } = doc;
  
    store.dispatch({
      type: TEA_ACTION_TYPES.ADD_TEA,
      payload: { ...data, teaId }
    })

    return { ...data, teaId };
  } catch ({ message }) {
    console.error(message)
  }  
}

export const editTeaAction = async (teaData) => {
  try {
    const { image, ...otherData } = teaData;
    
    if(!!image) {
      const imageRef = await storage.child(image.name).put(image);
      const imageURL = await imageRef.ref.getDownloadURL();

      otherData.imageURL = imageURL; 
    }

    const docRef = await teaBase.doc(otherData.teaId);

    await docRef.update({
      ...otherData,
      createdDate: JSON.stringify(otherData.createdDate),
    });
 
    store.dispatch({
      type: TEA_ACTION_TYPES.EDIT_TEA,
      payload: otherData
    })

    return otherData;
  } catch ({ message }) {
    console.error(message)
  }  
}

export const deleteTeaAction = async (teaId) => {
  try {
    const docRef = await teaBase.doc(teaId);
    await docRef.delete();

    store.dispatch({
      type: TEA_ACTION_TYPES.REMOVE_TEA,
      payload: teaId
    })
  } catch ({ message }) {
    console.error(message)
  }  
}

//// Comments Actions ////

export const getCommentAction = async () => {
  try {
    const querySnapshot = await commentsBase.get()
    const data = {};

    querySnapshot.forEach(doc => {
      const commentData = doc.data();
      
      data[commentData.teaId] = [...(data[commentData.teaId] || []), {
        ...commentData,
        createdDate: new Date(JSON.parse(commentData.createdDate)),
        commentId: doc.id
      }]
    });

    store.dispatch({
      type: COMMENT_ACTION_TYPES.GET_COMMENT,
      payload: data
    })
  } catch ({ message }) {
    console.error(message)
  }  
}

export const addCommentAction = async (commentData) => {
  try {
    const docRef = await commentsBase.add(commentData);
    const doc = await docRef.get();

    if(!doc.exists) {
      return;
    }

    const data = doc.data();
    const { id: commentId } = doc;
  
    store.dispatch({
      type: COMMENT_ACTION_TYPES.ADD_COMMENT,
      payload: { ...data, commentId }
    })
  } catch ({ message }) {
    console.error(message)
  }  
}

//// Auth Actions ////

export const loginAction = ({ email, uid }) => {
  loginButton.classList.add('display-none');
  signupButton.classList.add('display-none');
  logoutButton.classList.remove('display-none');
  addTeaButton.classList.remove('display-none');
  emailTitle.innerText = email;

  store.dispatch({
    type: AUTH_ACTION_TYPES.LOG_IN,
    payload: { email, userId: uid }
  })
}

export const logoutAction = () => {
  loginButton.classList.remove('display-none');
  signupButton.classList.remove('display-none');
  logoutButton.classList.add('display-none');
  addTeaButton.classList.add('display-none');
  emailTitle.innerText = '';

  store.dispatch({
    type: AUTH_ACTION_TYPES.LOG_OUT
  })
}