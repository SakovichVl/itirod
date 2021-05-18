import { mainContainer } from "./mainElements.js";
import { selectExtendedTeaList } from "./store/selectors.js";
import { createButton, createInputNode, createSection, createTextNode } from "./utils.js";

export function createSearchForm(name, minPrice, maxPrice) {
  const values = {
    name,
    minPrice,
    maxPrice,
  }

  const formNode = document.createElement('form');
  formNode.className = 'search-form';

  const teaNameTitleNode = createTextNode('p', 'search-title', 'Tea Name:');
  const minPriceTitleNode = createTextNode('p', 'search-title', 'Min Price:');
  const maxPriceTitleNode = createTextNode('p', 'search-title', 'Max Price:');

  const teaNameInputNode = createInputNode({ name: 'name',  className: 'search-input', values, value: name });
  const minPriceInputNode = createInputNode({ name: 'minPrice',  className: 'search-input', values,  type: 'number', value: minPrice });
  const maxPriceInputNode = createInputNode({ name: 'maxPrice',  className: 'search-input', values,  type: 'number', value: maxPrice });

  const buttonNode = createButton({ text: 'Search', type: 'submit' });

  formNode.appendChild(teaNameTitleNode);
  formNode.appendChild(teaNameInputNode);
  formNode.appendChild(minPriceTitleNode);
  formNode.appendChild(minPriceInputNode);
  formNode.appendChild(maxPriceTitleNode);
  formNode.appendChild(maxPriceInputNode);
  formNode.appendChild(buttonNode);

  formNode.addEventListener('submit', e => {
    e.preventDefault();

    createSearchPage(values);
  })

  return formNode;
}

const getFilteredTea = ({ name, minPrice, maxPrice, teaList }) => {
  return teaList.filter(tea => {
    if(name && name.toLowerCase() !== tea.name.toLowerCase()) {
      return false;
    }

    if(minPrice && tea.price < minPrice) {
      return false;
    }

    if(maxPrice && tea.price > maxPrice) {
      return false;
    }

    return true;
  })
}

export function createSearchPage({ name, minPrice, maxPrice }= {}) {
  const teaList = selectExtendedTeaList();
  const filteredTea = getFilteredTea({ name, minPrice, maxPrice, teaList });

  mainContainer.innerHTML = '';

  const form = createSearchForm(name, minPrice, maxPrice);
  const itemsSection = createSection('', filteredTea);

  mainContainer.appendChild(form);
  mainContainer.appendChild(itemsSection);
}