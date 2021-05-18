import { mainContainer } from "./mainElements.js";
import { selectExtendedTeaList } from "./store/selectors.js";
import { createSection } from "./utils.js";

const getTop5Tea = (teaList) => {
  return [...teaList].sort(({ rate: a }, { rate: b }) => b - a).slice(0, 5);
}

const getRecent10Tea = (teaList) => {
  return [...teaList].sort(({ createdDate: a }, { createdDate: b }) => a - b).slice(0, 10);
}

export const createMainPage = async () => {
  let teaList = selectExtendedTeaList();

  mainContainer.innerHTML = '';

  const top5Tea = getTop5Tea(teaList);
  const recent10Tea = getRecent10Tea(teaList);

  const topEntitiesSection = createSection('Top entities', top5Tea);
  const recentlyAddedSection = createSection('Recently added', recent10Tea);
 
  mainContainer.appendChild(topEntitiesSection);
  mainContainer.appendChild(recentlyAddedSection);
}
