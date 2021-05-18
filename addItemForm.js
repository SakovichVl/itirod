import { createTextNode, createInputNode, createButton, createFileInputNode } from "./utils.js";
import { addTeaAction } from "./store/actions.js";
import { selectAuth } from "./store/selectors.js";
import { createItemPage } from "./itemPage.js";

export function createAddItemForm() {
  const { email, userId } = selectAuth();

  const values = {
    userName: email,
    userId,
    image: '',
    name: '',
    description: '',
    price: '',
    place: '',
    rate: '',
  }

  const formNode = document.createElement('form');
  formNode.className = 'add-form';

  const titleNode = createTextNode('h3', 'section-title', 'Add tea');
  const nameTitleNode = createTextNode('p', 'item-title', 'Name:');
  const imageTitleNode = createTextNode('p', 'item-title', 'Image:');
  const descriptionTitleNode = createTextNode('p', 'item-title', 'Description:');
  const priceTitleNode = createTextNode('p', 'item-title', 'Price:');
  const placeTitleNode = createTextNode('p', 'item-title', 'Place:');
  const rateTitleNode = createTextNode('p', 'item-title', 'Rate:');

  const imageInputNode = createFileInputNode({ name: 'image', values });
  const nameInputNode = createInputNode({ name: 'name', isRequired: true, values });
  const descriptionTextareaNode = createInputNode({ 
    nodeType: 'textarea',
    className: 'textarea',
    name: 'description',
    isRequired: true,
    values
  });
  const priceInputNode = createInputNode({ name: 'price', isRequired: true, values,  type: 'number' });
  const placeInputNode = createInputNode({ name: 'place', values });
  const rateInputNode = createInputNode({ name: 'rate', values,  type: 'number', min: '0', max: '5' });

  const buttonNode = createButton({ text: 'Add', type: 'submit' });

  formNode.appendChild(titleNode);
  formNode.appendChild(imageTitleNode);
  formNode.appendChild(imageInputNode);
  formNode.appendChild(nameTitleNode);
  formNode.appendChild(nameInputNode);
  formNode.appendChild(descriptionTitleNode);
  formNode.appendChild(descriptionTextareaNode);
  formNode.appendChild(priceTitleNode);
  formNode.appendChild(priceInputNode);
  formNode.appendChild(placeTitleNode);
  formNode.appendChild(placeInputNode);
  formNode.appendChild(rateTitleNode);
  formNode.appendChild(rateInputNode);
  formNode.appendChild(buttonNode);

  formNode.addEventListener('submit',async (e) => {
    e.preventDefault();
  
    const teaData = await addTeaAction({
      ...values,
      createdDate: JSON.stringify(new Date()),
    })

    createItemPage(teaData);
  })

  return formNode;
}