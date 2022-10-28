/* eslint-disable no-param-reassign */

import { User } from '../types/User';
import { Details, detailsKeys } from '../types/Details';

import fetchUser from '../api/fetchUser';

import { showToast } from '../helpers/toastify';

const renderDetails = (user: User, element: HTMLElement): void => {
  const detailsMapping: {
    className: string;
    value: string;
  }[] = [
    {
      className: '.person-info__full-name',
      value: user.name,
    },
    {
      className: '.person-info__company',
      value: user.company.name,
    },
    {
      className: '.person-info__street',
      value: user.address.street,
    },
    {
      className: '.person-info__suite',
      value: user.address.suite,
    },
    {
      className: '.person-info__city',
      value: user.address.city,
    },
    {
      className: '.person-info__zip',
      value: user.address.zipcode,
    },
    {
      className: '.person-info__email',
      value: user.email,
    },
  ];

  detailsMapping.forEach((detail) => {
    element.querySelector(detail.className).textContent = detail.value;
  });
};

const loadDetails = (element: HTMLElement, userId: number): void => {
  const button = element.querySelector('.person-info__fetch');
  button.classList.add('person-info__fetch_active');
  fetchUser(userId).then((user: User) => {
    renderDetails(user, element);
    button.classList.remove('person-info__fetch_active');
  }).catch(() => {
    showToast('Ошибка при загрузке реквезитов пользователя');
    button.classList.remove('person-info__fetch_active');
  });
};

const generateRandomId = (excludeNumbers: number[]): number => {
  let random;
  do {
    random = Math.floor(Math.random() * 10) + 1;
  } while (excludeNumbers.includes(random));
  return random;
};

const saveDetails = (details: Details): void => {
  localStorage.setItem('details', JSON.stringify(details));
};

const generateDetails = (): Details => {
  const senderId = generateRandomId([]);
  const recipientId = generateRandomId([senderId]);
  return {
    senderId,
    recipientId,
  };
};

const restoreDetails = (): Details => {
  const invoiceDetails = localStorage.getItem('details');
  if (invoiceDetails) {
    return JSON.parse(invoiceDetails);
  }
  const newUserDetails = generateDetails();
  saveDetails(newUserDetails);
  return newUserDetails;
};

export default (async function () {
  const details: Details = restoreDetails();

  const detailsElements = document.querySelectorAll('.person-info') as NodeListOf<HTMLElement>;

  loadDetails(detailsElements[0], details.senderId);
  loadDetails(detailsElements[1], details.recipientId);

  const fetchUserButtons = document.querySelectorAll('.person-info__fetch');
  fetchUserButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const updatedId = generateRandomId([details.senderId, details.recipientId]);
      details[detailsKeys[index]] = updatedId;
      loadDetails(detailsElements[index], updatedId);
      saveDetails(details);
    });
  });
}());
