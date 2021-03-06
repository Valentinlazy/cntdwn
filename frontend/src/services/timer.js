import { API_URL } from '../config';

import Firebase from './firebase';

export async function post(data) {
  console.log(data);
  try {
    const timer = await Firebase.saveTimer(data);
    const res = await fetch(`${API_URL}/api/timers`, {
      method: 'POST',
      body: JSON.stringify(timer),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      referrer: 'no-referrer',
    })
      .then(response => response.json());
    
    return {
      ...timer,
      url: res ? res.url : '',
    };
  } catch (err) {
    console.error(err);
  }
}

export function get(id) {
  try {
    return Firebase.getTimer(id);
  } catch (err) {
    console.error(err);
  }
  
  return fetch(`${API_URL}/api/timers/${id}`)
    .then(response => response.json());
}
