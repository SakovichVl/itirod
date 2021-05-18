import { createItemPage } from "./itemPage.js";

export function createTextNode(type, className, text) {
  const textNode = document.createElement(type);
  textNode.className = className;
  textNode.innerText = text;

  return textNode;
}

export function createFileInputNode({
  name, 
  values = {},
}) {
  const inputNode = document.createElement('input');
  inputNode.className = 'input';
  inputNode.setAttribute('name', name);
  inputNode.setAttribute('type', 'file');
  inputNode.setAttribute('accept', '.jpg, .jpeg, .png');

  inputNode.addEventListener('change', ({ target }) => {
    values[name] = target.files[0];
  })

  return inputNode
}

export function createInputNode({ 
  nodeType = 'input',
  className = 'input',
  name, 
  value,
  type = 'text',
  isRequired = false,
  values = {},
  max,
  min
}) {
  const inputNode = document.createElement(nodeType);
  inputNode.className = className;
  inputNode.setAttribute('name', name);
  inputNode.setAttribute('type', type);
  min && inputNode.setAttribute('min', min);
  max && inputNode.setAttribute('max', max);
  value && (inputNode.value = value);

  isRequired && inputNode.setAttribute('required', isRequired);

  inputNode.addEventListener('change', ({ target }) => {
    values[name] = target.value;
  })

  return inputNode;
}

export function createButton({ text, type = 'button', className = 'button' }) {
  const buttonNode = document.createElement('button');
  buttonNode.className = className;
  buttonNode.innerText = text;
  buttonNode.setAttribute('type', type);

  return buttonNode;
}

export const createImage = (src, className) => {
  const imageNode = document.createElement('img');
  imageNode.className = className;
  imageNode.src = src;

  return imageNode;
}

export function createItem({ name, description, price, place, rate, teaId, imageURL, ...teaData }) {
  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'item-card';

  const nameNode = createTextNode('h3', 'item-name', name);
  const descriptionNode = createTextNode('p', 'item-description', description);
  const priceNode = createTextNode('p', 'item-price', `Price: ${price}`);
  const placeNode = createTextNode('p', 'item-place', `Place: ${place}`);
  const rateNode = createTextNode('p', 'item-rate', `Rate: ${rate}`);

  if(imageURL) {
    const imageNode = createImage(imageURL, 'item-image');

    wrapperNode.appendChild(imageNode);
  }

  wrapperNode.appendChild(nameNode);
  wrapperNode.appendChild(descriptionNode);
  wrapperNode.appendChild(priceNode);
  wrapperNode.appendChild(placeNode);
  wrapperNode.appendChild(rateNode);

  wrapperNode.addEventListener('click', () => {
    createItemPage({ teaId, name, description, place, rate, price, imageURL, ...teaData })
  })

  return wrapperNode;
}

export function createSection(title, items) {
  const sectionNode = document.createElement('section');
  sectionNode.className = 'section';

  const titleNode = document.createElement('h2');
  titleNode.className = 'section-title';
  titleNode.innerText = title;

  const containerNode = document.createElement('div');
  containerNode.className = 'container';

  sectionNode.appendChild(titleNode);
  sectionNode.appendChild(containerNode);
 
  items.forEach(data => {
    const item = createItem(data);
    
    containerNode.appendChild(item);
  })

  return sectionNode;
}
