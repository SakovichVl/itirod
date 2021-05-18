import { createAddCommentForm, createCommentItem } from "./comment.js";
import { mainContainer } from "./mainElements.js";
import { selectAuth, selectSortedTeaCommentsList } from "./store/selectors.js";
import { createButton, createFileInputNode, createImage, createInputNode, createTextNode } from "./utils.js";
import { deleteTeaAction, editTeaAction } from "./store/actions.js";
import { createMainPage } from "./mainPage.js";

export const createEditForm = (teaData) => {
  const { userName, userId, name, description, price, place, rate } = teaData;

  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'edit-tea-modal';
  wrapperNode.classList.add('display-none');

  const values = {
    image: '',
    userName,
    userId,
    name,
    description,
    price,
    place,
    rate,
  }

  const formNode = document.createElement('form');
  formNode.className = 'add-form edit-form';

  const imageTitleNode = createTextNode('p', 'item-title', 'Image:');
  const titleNode = createTextNode('h3', 'section-title', 'Edit tea');
  const nameTitleNode = createTextNode('p', 'item-title', 'Name:');
  const descriptionTitleNode = createTextNode('p', 'item-title', 'Description:');
  const priceTitleNode = createTextNode('p', 'item-title', 'Price:');
  const placeTitleNode = createTextNode('p', 'item-title', 'Place:');
  const rateTitleNode = createTextNode('p', 'item-title', 'Rate:');

  const imageInputNode = createFileInputNode({ name: 'image', values });
  const nameInputNode = createInputNode({ name: 'name', isRequired: true, values, value: name });
  const descriptionTextareaNode = createInputNode({ 
    nodeType: 'textarea',
    className: 'textarea',
    name: 'description',
    isRequired: true,
    values,
    value: description
  });
  const priceInputNode = createInputNode({ name: 'price', isRequired: true, values,  type: 'number', value: price });
  const placeInputNode = createInputNode({ name: 'place', values, value: place });
  const rateInputNode = createInputNode({ name: 'rate', values,  type: 'number', min: '0', max: '5', value: rate });

  const buttonNode = createButton({ text: 'Edit', type: 'submit' });
  const closeButtonNode = createButton({ text: 'Close', className: 'button close-button' });

  closeButtonNode.addEventListener('click', () => {
    wrapperNode.classList.add('display-none');
  })

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
  formNode.appendChild(closeButtonNode);

  formNode.addEventListener('submit',async (e) => {
    e.preventDefault();
    const image = !!values.image ? values.image : undefined;

    const data = {
      ...teaData,
      ...values,
      image
    }
 
    const newData = await editTeaAction(data);

    wrapperNode.classList.add('display-none');
    createItemPage(newData);
  })

  wrapperNode.appendChild(formNode);

  return wrapperNode;
}

export const createDataManagementBlock = (teaData) => {
  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'data-managemnet-block';

  const editButtonNode = createButton({ text: 'Edit', className: 'button edit-button' });
  const deleteButtonNode = createButton({ text: 'Delete', className: 'button delete-button' });
  const editForm = createEditForm(teaData);

  editButtonNode.addEventListener('click', () => {
    editForm.classList.remove('display-none');
  })

  deleteButtonNode.addEventListener('click', async () => {
    await deleteTeaAction(teaData.teaId);

    createMainPage();
  })

  wrapperNode.appendChild(editButtonNode);
  wrapperNode.appendChild(deleteButtonNode);
  wrapperNode.appendChild(editForm);

  return wrapperNode;
}

export function createItemDescriptionBlock(teaData, isCurrentUserCreator) {
  const { name, description, place, rate, userName } = teaData;
  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'item-description-block';

  const nameNode = createTextNode('h2', 'name', name);
  const descriptionNode = createTextNode('p', 'description', description);
  const placeNode = createTextNode('p', 'place', `Place: ${place}`);
  const userNameNode = createTextNode('p', 'place', `User: ${userName}`);
  const rateNode = createTextNode('p', 'rating', `Rate: ${rate}`);

  wrapperNode.appendChild(nameNode);
  wrapperNode.appendChild(descriptionNode);
  wrapperNode.appendChild(userNameNode);
  wrapperNode.appendChild(placeNode);
  wrapperNode.appendChild(rateNode);

  if(isCurrentUserCreator) {
    const dataManagementBlock = createDataManagementBlock(teaData);

    wrapperNode.appendChild(dataManagementBlock);
  }


  return wrapperNode;
}

export function createPriceBlock(price) {
  const wrapperNode = document.createElement('div');
  wrapperNode.className = 'item-price-block';

  const priceNode = createTextNode('p', 'rating', `Avg. Price: ${price}`);

  wrapperNode.appendChild(priceNode);

  return wrapperNode;
}

export function createItemPage(teaData) {
  const { teaId, price, imageURL, userId: teaCreator } = teaData;
  const comments = selectSortedTeaCommentsList(teaId);
  const { userId, email } = selectAuth();
  const isCurrentUserCreator = userId === teaCreator;

  mainContainer.innerHTML = '';

  const itemInfoSectionNode = document.createElement('section');
  itemInfoSectionNode.className = 'item-info';

  const itemDescriptionBlock = createItemDescriptionBlock(teaData, isCurrentUserCreator);
  const priceBlock = createPriceBlock(price);

  if(imageURL) {
    const imageNode = createImage(imageURL, 'item-image-big');

    itemInfoSectionNode.appendChild(imageNode);
  }

  itemInfoSectionNode.appendChild(itemDescriptionBlock);
  itemInfoSectionNode.appendChild(priceBlock);

  const commentsSectionNode = document.createElement('section');
  commentsSectionNode.className = 'comments';

  if(!!userId) {
    const commentForm = createAddCommentForm(teaId, userId, email, teaData);
  
    commentsSectionNode.appendChild(commentForm);
  }

  comments.forEach(comment => {
    const commentNode = createCommentItem(comment);

    commentsSectionNode.appendChild(commentNode);
  })

  mainContainer.appendChild(itemInfoSectionNode);
  mainContainer.appendChild(commentsSectionNode);
}