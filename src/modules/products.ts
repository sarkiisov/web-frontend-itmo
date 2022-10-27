/* eslint-disable no-param-reassign */

import { v4 as uuidv4 } from 'uuid';

import { Product } from '../types/Product';

import fetchImage from '../api/fetchImage';

import { productObject } from '../helpers/validation';
import { showToast } from '../helpers/toastify';
import { numberFormat } from '../helpers/numberFormat';

const restoreProducts = (): Product[] => {
  const products = localStorage.getItem('products');
  if (products) {
    return JSON.parse(products);
  }
  localStorage.setItem('products', JSON.stringify([]));
  return [];
};

const calculateSumOfProducts = (products: Product[]): number => products.reduce(
  (sum, curProduct) => sum + curProduct.price * curProduct.quantity,
  0,
);

const renderRoboImage = (hash: string, element: HTMLElement): void => {
  fetchImage(hash).then((image: HTMLElement) => {
    image.classList.add('table__product__image-inner');
    element.appendChild(image);
  }).catch(() => {
    showToast('Ошибка при загрузки изображения продукта');
  });
};

const renderProduct = (product: Product): void => {
  const getProductHTML = () => `<tr class="table__tr table-product__tr">
    <td class="table__td" data-label="Продукт">
      <div class="table__cell table__product">
        <div class="table__product__image-container" id="image__${product.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 25 25" fill="none" class="table__product__image-preloader">
            <g class="svg-group">
              <path d="M19.1021 3.18034H5.10205C3.99748 3.18034 3.10205 4.07577 3.10205 5.18034V19.1803C3.10205 20.2849 3.99748 21.1803 5.10205 21.1803H19.1021C20.2066 21.1803 21.1021 20.2849 21.1021 19.1803V5.18034C21.1021 4.07577 20.2066 3.18034 19.1021 3.18034Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.60205 10.1803C9.43048 10.1803 10.1021 9.50877 10.1021 8.68034C10.1021 7.85192 9.43048 7.18034 8.60205 7.18034C7.77362 7.18034 7.10205 7.85192 7.10205 8.68034C7.10205 9.50877 7.77362 10.1803 8.60205 10.1803Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21.1021 15.1803L16.1021 10.1803L5.10205 21.1803" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </div>
        <p class="table__product__name">${product.name}</p>
      </div>
    </td>
    <td class="table__td" data-label="Цена">
      <div class="table__cell table__price">
          <p>${numberFormat.format(product.price)}</p>
      </div>
    </td>
    <td class="table__td" data-label="Количество">
      <div class="table__cell table__amount">
        <p>x ${product.quantity}</p>
      </div>
    </td>
    <td class="table__td" data-label="Общая стоимость">
      <div class="table__cell table__total">
        <p>${numberFormat.format(product.price * product.quantity)}</p>
      </div>
    </td>
  </tr>
  `;

  const bearingElement = document.querySelector('.table-form__tr');
  bearingElement.insertAdjacentHTML('beforebegin', getProductHTML());

  const productImageElement = document.querySelector(`#image__${product.id}`) as HTMLElement;
  renderRoboImage(product.name, productImageElement);
};

const renderProductsSum = (): void => {
  const products = restoreProducts();
  const productSumElement = Array.from(document.querySelectorAll('.table__sum')).pop();
  productSumElement.textContent = numberFormat.format(calculateSumOfProducts(products));
};

const saveProduct = (product: Product): void => {
  const products: Product[] = [...restoreProducts(), product];
  localStorage.setItem('products', JSON.stringify(products));
};

export default (async function () {
  const products: Product[] = restoreProducts();
  products.forEach((product) => {
    renderProduct(product);
  });
  renderProductsSum();

  const productForm = document.forms.namedItem('products');
  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const productValues = ['name', 'price', 'quantity'].reduce((productAcc, key) => {
      productAcc[key] = (productForm.elements.namedItem(key) as HTMLInputElement).value;
      return productAcc;
    }, {}) as Omit<Product, 'id'>;
    try {
      await productObject.validate(
        productValues,
        { abortEarly: false },
      );
      productForm.reset();
      const product: Product = { id: uuidv4(), ...productValues };
      saveProduct(product);
      renderProduct(product);
      renderProductsSum();
    } catch (errors) {
      errors.inner.forEach((error) => {
        showToast(error.message);
      });
    }
  });
}());
