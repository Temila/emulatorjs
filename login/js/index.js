document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');
  errorDiv.textContent = '';
  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password}),
    credentials: 'include'
  });
  if (res.ok) {
    // 登录成功后再连接 Socket.IO
    var host = window.location.hostname; 
    var port = window.location.port;
    var protocol = window.location.protocol;
    var socket = io(protocol + '//' + host + ':' + port, {
      path: '/socket.io',
      withCredentials: true
    });
    socket.on('connect', () => {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = '/';
      }
    });
    socket.on('connect_error', (err) => {
      errorDiv.textContent = 'Socket 认证失败: ' + err.message;
    });
  } else {
    errorDiv.textContent = '用户名或密码错误';
  }
};