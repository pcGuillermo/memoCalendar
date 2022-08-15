import endpoint from './endpoint';

export function postEventService({
  title, user, backgroundColor, start, end,
}, token) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);

  const body = {
    title,
    user,
    backgroundColor,
    start,
    end,
  };
  const reqOption = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(body),
  };
  return fetch(`${endpoint}/product`, reqOption);
}
export function getEventService(userId, token) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);

  const reqOption = {
    method: 'GET',
    headers: myHeaders,
  };
  return fetch(`${endpoint}/product/${userId}`, reqOption);
}
export function deleteEventService(productId, token) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('x-access-token', token);

  const reqOption = {
    method: 'DELETE',
    headers: myHeaders,
  };
  return fetch(`${endpoint}/product/${productId}`, reqOption);
}
