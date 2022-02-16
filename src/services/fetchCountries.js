const COUNTRY_URL = 'https://restcountries.com/v3.1/name';

const fetchData = endpoint => {
  return fetch(`${COUNTRY_URL}/${endpoint}`).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  });
};

const fetchCountries = name => fetchData(`/${name}?fields=name,capital,population,flags,languages`);

export { fetchData, fetchCountries };
