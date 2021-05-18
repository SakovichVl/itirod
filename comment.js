import { createItemPage } from "./itemPage.js";
import { addCommentAction } from "./store/actions.js";
import { createTextNode, createInputNode, createButton } from "./utils.js";

export function createAddCommentForm(teaId, userId, email, teaData) {
  const values = {
    userName: email,
    teaId,
    userId,
    text: '',
    price: '',
    rate: ''
  }

  const formNode = document.createElement('form');
  formNode.className = 'comment-form';

  const additionalInfoNode = document.createElement('div');
  additionalInfoNode.className = 'comment-additional-info';

  const nameTitleNode = createTextNode('p', 'comment-title', 'Comment Text:');
  const priceTitleNode = createTextNode('p', 'comment-additional-title', 'Price:');
  const rateTitleNode = createTextNode('p', 'comment-additional-title', 'Rate:');

  const textTextareaNode = createInputNode({ 
    nodeType: 'textarea',
    className: 'comment-text-input',
    name: 'text',
    isRequired: true,
    values
  });
  const priceInputNode = createInputNode({ 
    name: 'price',  
    className: 'comment-additional-input', 
    isRequired: true, 
    values 
  });
  const rateInputNode = createInputNode({ 
    name: 'rate',  
    className: 'comment-additional-input', 
    isRequired: true, 
    values,
    type: 'number',
    min: '0',
    max: '5'
  });

  const buttonNode = createButton({ text: 'Add comment', type: 'submit' });

  additionalInfoNode.appendChild(priceTitleNode);
  additionalInfoNode.appendChild(priceInputNode);
  additionalInfoNode.appendChild(rateTitleNode);
  additionalInfoNode.appendChild(rateInputNode);

  formNode.appendChild(nameTitleNode);
  formNode.appendChild(textTextareaNode);
  formNode.appendChild(additionalInfoNode);
  formNode.appendChild(buttonNode);

  formNode.addEventListener('submit', async (e) => {
    e.preventDefault();

    await addCommentAction({
      ...values,
      createdDate: JSON.stringify(new Date()),
    })

    createItemPage(teaData);
  })

  return formNode;
}

export function createCommentItem({ rate, text, userName, price }) {
  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'comment';

  const rateNode = createTextNode('p', 'comment-rating', `Rate: ${rate}`);
  const priceNode = createTextNode('p', 'comment-rating', `Price: ${price}`);
  const userNameNode = createTextNode('p', 'comment-user-name', `User: ${userName}`);
  const textNode = createTextNode('p', 'comment-text', `Comment Text: ${text}`);

  wrapperNode.appendChild(rateNode);
  wrapperNode.appendChild(priceNode);
  wrapperNode.appendChild(userNameNode);
  wrapperNode.appendChild(textNode);

  return wrapperNode;
}