import { AUTH_ACTION_TYPES, COMMENT_ACTION_TYPES, TEA_ACTION_TYPES } from "./actions.js";

export const initialState = {
  comments: {},
  tea: {},
  auth: {}
};

export const reducer = (state, { type, payload }) => {
  const { comments, tea, auth } = state;

  switch (type) {
    //// Comments Handling //// 

    case COMMENT_ACTION_TYPES.GET_COMMENT: 
      return { tea, auth, comments: payload || comments };

    case COMMENT_ACTION_TYPES.ADD_COMMENT: {
      const newTeaComments = [...(comments[payload.teaId] || []), payload]
      const newComments = { ...comments, [payload.teaId]: newTeaComments }

      return { tea, auth, comments: newComments }
    }

    //// Tea Handling //// 

    case TEA_ACTION_TYPES.GET_TEA: 
      return { comments, auth, tea: payload || tea };
      
    case TEA_ACTION_TYPES.EDIT_TEA:
    case TEA_ACTION_TYPES.ADD_TEA: {
      const newTea = { ...tea, [payload.teaId]: payload };

      return { comments, auth, tea: newTea }
    }
      
    case TEA_ACTION_TYPES.REMOVE_TEA: {
      const newTea = { ...tea };
      delete newTea[payload];

      return { comments, auth, tea: newTea };
    }

    //// Auth Handling //// 
      
    case AUTH_ACTION_TYPES.LOG_IN: 
      return { comments, tea, auth: payload };

    case AUTH_ACTION_TYPES.LOG_OUT: 
      return { comments, tea, auth: {} };

    default:
      return state;
  }
}