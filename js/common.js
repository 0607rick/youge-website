const renderNavbar = (user) => {
  const isLoggedIn = !!user;
  const displayName = user?.displayName || user?.email?.split('@')[0] || '訪客';

  // 1. 先全部隱藏
  document.querySelector('.auth-placeholder').style.display = 'none';
  document.querySelector('.auth-logged-in').style.display = 'none';
  document.querySelector('.auth-logged-out').style.display = 'none';

  // 2. 再顯示正確的
  if (isLoggedIn) {
    document.querySelector('.auth-logged-in span').textContent = `Hi, ${displayName}`;
    document.querySelector('.auth-logged-in button').onclick = () => {
      firebase.auth().signOut().then(() => location.reload());
    };
    document.querySelector('.auth-logged-in').style.display = 'flex';
  } else {
    document.querySelector('.auth-logged-out button').onclick = () => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    };
    document.querySelector('.auth-logged-out').style.display = 'block';
  }

  // 手機選單一樣要綁事件（因為原本被覆蓋掉了）
  document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
  });
};