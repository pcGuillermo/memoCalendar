import endpoint from './endpoint';

export function postSigninService({ email, password }) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const body = {
    email,
    password,
  };
  const reqOption = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
  };
  return fetch(`${endpoint}/auth/signin`, reqOption);
}

export function postSignupService({ email, password, username }) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const body = {
    username,
    email,
    password,
    roles: ['user'],
  };
  const reqOption = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
  };
  return fetch(`${endpoint}/auth/signup`, reqOption);
}
