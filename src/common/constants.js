// LOGIN TOKEN
export const TOKEN = 'TOKEN';

// PATHS
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MOVIE_CARD: '/movies-card',
  MOVIE_CREATE: '/movies-card/create',
  PERSON_LIST: '/persons-list',
  PERSON_CREATE: '/persons-list/create',
};

// PORTAL METHODS
export const injectUsingPortal = (portalId) => {
  return document.getElementById(portalId);
};

export const portalIdExist = (portalId) => {
  return !!injectUsingPortal(portalId);
};

// SORT FIELDS
export const FIELD_OPTIONS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  RELEASE_DATE: 'releaseDate',
  POPULARITY: 'popularity',
  VOTE_AVERAGE: 'voteAverage',
};

// SORT OPTIONS
export const SORT_OPTIONS = {
  ASCENDING: 'ASC',
  DESCENDING: 'DESC',
};

// CATEGORIES OPTIONS
export const CATEGORIES = {
  LATEST: 'LATEST',
  PLAYING_IN_THEATERS: 'PLAYING_IN_THEATERS',
  POPULAR: 'POPULAR',
  TOP_RATED: 'TOP_RATED',
  UPCOMING: 'UPCOMING',
};

// DATES
export const DEFAULTDATEFORMAT = 'DD/MM/YYYY';
export const pmst = 'DD-MM-YYYY';
export const DEFAULTDATETIMEFORMAT = 'DD/MM/YYYY h:mm a';
export const DEFAULTDATETIMEFORMATFORREPORTS = 'YYYY-MM-DD';
export const DATETIMEWITHDIVIDE = 'DD/MM/YYYY | h:mm a';
export const DATETIMEWITHBRACKET = 'DD/MM/YYYY (h:mm a)';
export const DATE_TIME_WITH_AT = 'DD MMM [at] h:mm a';
export const DAY_DATE_MONTH_YEAR_FORMAT = 'ddd Do MMM YYYY';

// Data Checking Functions
export const checkArray = (data) =>
  data !== undefined &&
  data !== null &&
  data !== '' &&
  Array.isArray(data) &&
  data.length > 0;

export const checkPreDefinedValue = (data) =>
  data !== undefined && data !== null && data !== '';
