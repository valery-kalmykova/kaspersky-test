import './index.css';
import { products, currencies } from '../utils/data';

let currentCurrency = localStorage.getItem('currency') ? localStorage.getItem('currency') : 'GBP';
let initialStateProduct;

const productOptions = document.querySelector('.select__product-options');
const currencyOptions = document.querySelector('.select__currency-options');
const productPriceNew = document.querySelector('.buy__price-text--new');

const setCustomSelect = (parent, items, defaultSelectedValue) => {  
  let selectParent = document.querySelector(parent);
  let selectItem = document.querySelectorAll(items);
  let selectedItem = selectParent.querySelector('.selected__value');
  selectedItem.textContent = defaultSelectedValue;
  if (parent === '.select__product') {
    selectItem.forEach(item => {
      if(item.dataset.product === defaultSelectedValue) {
        item.classList.add('select__product-option--selected');
      }
    })
  }

  selectParent.addEventListener('click',(e) => {selectToggle(e)})

  function selectChoose(e) {   
    if (parent === '.select__currency') {
      selectedItem.textContent = e.target.textContent;
      currentCurrency = selectedItem.textContent;
      localStorage.setItem('currency', currentCurrency);
      document.location.reload();
    }

    if (parent === '.select__product') {
      const currentPrice = e.target.dataset.price;
      selectedItem.textContent = e.target.dataset.product;
      setBuyPrice(currentPrice)
    }
  }

  selectItem.forEach(item => {
      item.addEventListener('click', (e) => {
        selectChoose(e);
        if(e.target.classList.contains('select__product-option')) {
          selectItem.forEach(item => {
            item.classList.remove('select__product-option--selected')
          })
          item.classList.add('select__product-option--selected');
        }
      })
  });

  function selectToggle(e) {
    selectParent.classList.toggle('is-active');    
    if (selectParent.classList.contains('is-active') && e.target.closest('div').classList.contains('selected__product-container')) {
      selectParent.querySelector('.select__product-options').classList.add('select__product-options--border');
    } else if ((e.target.closest('div').classList.contains('selected__product-container') || 
      e.target.closest('ul').classList.contains('select__product-options')) &&
      !selectParent.classList.contains('is-active')) {
      selectParent.querySelector('.select__product-options').classList.remove('select__product-options--border');
    }
  }  
};

const setCurrencyOptions = () => {
  while (currencyOptions.firstChild) {
    currencyOptions.removeChild(currencyOptions.firstChild);
  }
  for (const key in currencies) {
    const currencyOption = document.createElement('li');
    currencyOption.classList.add('select__currency-option');
    currencyOption.textContent = key;
    currencyOptions.appendChild(currencyOption);
  }  
}
setCurrencyOptions()

const setBuyPrice = (currentPrice) => {
  productPriceNew.querySelector('.buy__price-text--new-bg').textContent = currentPrice.split('.')[0];
  productPriceNew.querySelector('.buy__price-text--new-sm').textContent = `.${currentPrice.split('.')[1]}`;
}

const setProductOptions = () => {
  while (productOptions.firstChild) {
    productOptions.removeChild(productOptions.firstChild);
  }
  products.map(item => {    
    const year = item.length <= 1 ? 'Year' :'Years';
    const currency = currencies[currentCurrency];
    const productOption = document.createElement('li');
    productOption.classList.add('select__product-option');    
    productOption.textContent = `${item.device} Device, ${item.length} ${year}, ${currency}${item.price[currentCurrency]}`;
    productOption.dataset.product = `${item.device} Device, ${item.length} ${year}`;
    productOption.dataset.price = `${currency}${item.price[currentCurrency]}`;
    productOptions.appendChild(productOption);
  }
  );
}

setProductOptions();
initialStateProduct = document.querySelector('.select__product-options').children[2];
setBuyPrice(initialStateProduct.dataset.price)

setCustomSelect('.select__currency', '.select__currency-option', currentCurrency);
setCustomSelect('.select__product', '.select__product-option', initialStateProduct.dataset.product);

const buyContainer = document.querySelector(".buy");
const buyMobileFull = buyContainer.querySelector(".buy__grid-container");
const buyMobilePreview = buyContainer.querySelector(".buy__mobile-preview");
const buyCompability = buyContainer.querySelector('.buy__compability');
const navBarHeader = document.querySelector(".header");
const buyContainerPositionYTop = buyContainer.getBoundingClientRect().top;
const buyContainerPositionYBottom = buyContainer.getBoundingClientRect().bottom;
let prevScrollpos = window.pageYOffset;

window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;  
    if (prevScrollpos > currentScrollPos) {
      navBarHeader.style.top = "0";
      buyContainer.style.top = "64px";      
    } else {
      navBarHeader.style.top = "-64px";
      buyContainer.style.top = "0";      
    }
    prevScrollpos = currentScrollPos;

    if (currentScrollPos > buyContainerPositionYTop) {
      buyCompability.style.display = 'none';
    } else {
      buyCompability.style.display = 'flex';
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
      buyContainer.classList.remove('buy--sticky-desctop'); 
      let currentScrollPos = window.pageYOffset + window.innerHeight;    
        if (currentScrollPos > (buyContainerPositionYBottom + 50)) {
          buyMobileFull.style.display = "none";
          buyMobilePreview.classList.remove('buy__mobile-preview-hidden');
          buyContainer.classList.add('buy--sticky-mobile');
          buyContainer.style = `top: ${window.innerHeight - (buyMobilePreview.offsetHeight + 10)}px`;
        } else {
          buyMobileFull.style.display = "grid";
          buyMobilePreview.classList.add('buy__mobile-preview-hidden');
          buyContainer.classList.remove('buy--sticky-mobile');
          buyContainer.style = "";
        }  
    }
}

buyMobilePreview.addEventListener('click', (e) => {
  if (!e.target.classList.contains('buy__buttons-btn--mobile-preview')) {
    buyMobileFull.style.display = "grid";
    buyCompability.style.display = "none"
    buyMobilePreview.classList.add('buy__mobile-preview-hidden');
    buyContainer.style = `top: ${window.innerHeight - (buyMobileFull.offsetHeight + 10)}px`;
  }  
});
