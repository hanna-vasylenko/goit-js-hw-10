import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './services/fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

//получаем фетч запрос - возвращает промис
//вешаем слушатель на инпут - будет вызывать функцию - внутри ф-и получаем строку, которую ввел пользователь
// добавляем проверку - если инпут пустой - выход из ф-ии
// возвращает промис - проверяем - если в массиве - 1 объект - разметка одной страны, если в массиве от апишки - от 2 до 10 стран - выводим разметку списка стран
//если больше 10 - в нотифай выводим уведомление
//обрабатываем ошибку - кетч - выводим нотифай об ошибке
const countryInfoHandler = e => {
  e.preventDefault();
  const info = e.target.value.trim();
  if (!info) {
    clearCountries();
    return;
  }
  fetchCountries(info)
    .then(country => {
      if (country.length === 1) {
        clearCountries();
        renderOneCountry(country);

        return;
      } else if (country.length > 1 && country.length <= 10) {
        clearCountries();
        renderContries(country);
        //clearCountries();
        return;
      }
      Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
      return;
    })
    .catch(err => Notiflix.Notify.failure('Oops, there is no country with that name'));
};

const renderOneCountry = country => {
  const markup = createOneCountryMarkup(country);
  countryListRef.innerHTML = markup;
};

const renderContries = country => {
  const markup = createCountriesMarkup(country);
  console.log(countryInfoRef);
  countryInfoRef.insertAdjacentHTML('afterbegin', markup);
};

function createOneCountryMarkup(country) {
  return country
    .map(({ flags, name }) => {
      return `
 <li class = "country-item">
 <img class="country-pic" src ="${flags.svg}" alt="${name.official} flag" width ="50px">
 <h2> ${name.official}</h2>
 </li>`;
    })
    .join('');
}

function createCountriesMarkup(country) {
  return country
    .map(({ name, capital, population, flags, languages }) => {
      const allLanguages = Object.values(languages);
      return `
  <div class="countries">
   <img class="country-pic" src ="${flags.svg}" alt="${name.official} flag" width ="50px">
 <h2> ${name.official}</h2>
 <ul class ="country-list">
 <li class="country-list__item">
 <span> Capital: ${capital} </span>
 </li>
  <li class="country-list__item">
 <span> Population:  ${population}</span>
 </li>
  <li class="country-list__item">
 <span> Languages: ${allLanguages.join(', ')}</span>
 </li>
 </ul>
 </div>
  `;
    })
    .join('');
}
const clearCountries = () => {
  countryInfoRef.innerHTML = '';
  countryListRef.innerHTML = '';
};
inputRef.addEventListener('input', debounce(countryInfoHandler, DEBOUNCE_DELAY));
