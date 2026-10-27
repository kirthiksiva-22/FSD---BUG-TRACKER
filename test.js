const base = 'http://localhost:5000/api';

async function call(path, method, body, token) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: 'Bearer ' + token })
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

(async () => {
  console.log('1 Register:', await call('/auth/register', 'POST',
    { name: 'Asha', email: 'asha@x.com', password: '123', role: 'developer' }));

  const login = await call('/auth/login', 'POST',
    { email: 'asha@x.com', password: '123' });
  console.log('2 Login:', login);
  const token = login.token;

  console.log('3 Create bug:', await call('/bugs', 'POST',
    { title: 'Login fails', description: '500 error', priority: 'High' }, token));

  console.log('4 Update status:', await call('/bugs/1', 'PUT',
    { status: 'In Progress' }, token));

  console.log('5 Bug + history:',
    JSON.stringify(await call('/bugs/1', 'GET', null, token), null, 2));
})();