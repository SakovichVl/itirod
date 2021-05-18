import { store } from "../index.js";

export const selectTea = () => store.getState().tea;

export const selectCommets = () => store.getState().comments;

export const selectAuth = () => store.getState().auth;

export const selectTeaList = () => Object.values(selectTea());

export const selectTeaCommentsList = (teaId) => selectCommets()[teaId] || [];

export const selectSortedTeaCommentsList = (teaId) => selectTeaCommentsList(teaId).sort(({ createdDate: a }, { createdDate: b }) => b - a);

export const selectExtendedTeaList = () => {
  const teaList = selectTeaList();

  return teaList.map(tea => {
    const comments = selectTeaCommentsList(tea.teaId);
    const commentsAvgPrice = comments.reduce((acc, { price }) => acc + (+price), 0);
    const avgPrice = (+tea.price + commentsAvgPrice) / (1 + comments.length);
    const commentsAvgRate = comments.reduce((acc, { rate }) => acc + (+rate), 0);
    const avgRate = (+tea.rate + commentsAvgRate) / (1 + comments.length);
    
    return {
      ...tea,
      price: Math.floor(avgPrice),
      rate: Math.floor(avgRate),
    }
  })
}