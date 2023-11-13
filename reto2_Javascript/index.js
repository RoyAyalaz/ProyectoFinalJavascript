function checkLogin() {
  return localStorage.getItem('email') ? true : false;
}

function loadView() {
  const isLoggedIn = checkLogin();
  const filePath = isLoggedIn ? 'home.html' : 'welcome.html';
  console.log(isLoggedIn);

  window.location.href = filePath;
}

document.addEventListener('DOMContentLoaded', loadView);
