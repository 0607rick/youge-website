// js/common.js ← 直接整個覆蓋舊檔（已改成 rick / rick970607）
document.addEventListener('DOMContentLoaded', () => {
  const basePath = getBasePath();
  const ADMIN_USERNAME = 'rick';        // 你的管理員帳號
  const ADMIN_PASSWORD = 'rick970607';  // 你的管理員密碼

  let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  // 只有帳號完全等於 rick 才是管理員
  let isAdmin = currentUser && currentUser.username === ADMIN_USERNAME;

  // 插入美美的登入彈窗（只加一次）
  if (!document.getElementById('login-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="login-modal">
        <div class="modal-content">
          <span class="close-modal" onclick="closeModal()">×</span>
          <div class="modal-header">歡迎來到宥哥宇宙</div>
          
          <input type="text" id="modal-username" class="modal-input" placeholder="帳號">
          <input type="password" id="modal-password" class="modal-input" placeholder="密碼">
          <input type="password" id="modal-confirm-password" class="modal-input" placeholder="確認密碼" style="display:none;">

          <button id="login-submit" class="modal-btn">登入</button>
          <button id="register-toggle" class="modal-btn">沒有帳號？點我註冊</button>
        </div>
      </div>
    `);
  }

  // 導覽列
  const navHTML = `
    <nav class="navbar">
      <div class="logo-text-with-icon" onclick="location.href='${basePath}index.html'" style="cursor:pointer;display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.8rem;font-weight:900;color:white;">宥哥</span>
        <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:48px;height:48px;border-radius:12px;">
      </div>
      <div style="flex:1;"></div>
      <ul class="nav-links">
        <li><a href="${basePath}index.html" data-page="home">首頁</a></li>
        <li><a href="${basePath}about.html" data-page="about">關於我</a></li>
        <li><a href="${basePath}works.html" data-page="works">作品集</a></li>
        <li><a href="${basePath}articles/index.html" data-page="articles">文章</a></li>
        <li><a href="${basePath}guestbook.html" data-page="guestbook">留言板</a></li>
      </ul>
      <div class="admin-control">
        ${currentUser 
          ? `<span style="color:white;margin-right:1rem;">你好，${currentUser.username}</span>
             <button id="logout-btn" class="admin-btn">登出</button>`
          : `<button id="login-btn" class="admin-btn">登入</button>`
        }
      </div>
      <div class="hamburger">☰</div>
    </nav>
  `;
  document.getElementById('navbar-container').innerHTML = navHTML;

  // 手機選單
  document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
  });

  // 登入按鈕
  document.getElementById('login-btn')?.addEventListener('click', () => {
    document.getElementById('login-modal').classList.add('active');
    switchToLogin();
  });

  // 登出按鈕
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    alert('已登出');
    location.reload();
  });

  // 登入 ↔ 註冊切換
  document.getElementById('register-toggle').addEventListener('click', () => {
    if (document.getElementById('login-submit').textContent === '登入') {
      switchToRegister();
    } else {
      switchToLogin();
    }
  });

  function switchToLogin() {
    document.getElementById('modal-confirm-password').style.display = 'none';
    document.getElementById('login-submit').textContent = '登入';
    document.getElementById('register-toggle').textContent = '沒有帳號？點我註冊';
  }

  function switchToRegister() {
    document.getElementById('modal-confirm-password').style.display = 'block';
    document.getElementById('login-submit').textContent = '註冊並登入';
    document.getElementById('register-toggle').textContent = '已經有帳號？點我登入';
  }

  // 提交表單
  document.getElementById('login-submit').addEventListener('click', () => {
    const username = document.getElementById('modal-username').value.trim();
    const password = document.getElementById('modal-password').value;
    const confirm  = document.getElementById('modal-confirm-password').value;
    const isRegister = document.getElementById('login-submit').textContent.includes('註冊');

    if (!username || !password) return alert('請填寫帳號與密碼！');
    if (isRegister && password !== confirm) return alert('兩次密碼不一致！');

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (isRegister) {
      if (users[username]) return alert('帳號已存在！');
      users[username] = { password };
      localStorage.setItem('users', JSON.stringify(users));
      alert('註冊成功！正在登入…');
    }

    // 登入驗證
    if (users[username]?.password === password || (username === ADMIN_USERNAME && password === ADMIN_PASSWORD)) {
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      closeModal();
      location.reload();
    } else {
      alert('帳號或密碼錯誤');
    }
  });

  // 給留言板判斷是否為管理員
  window.isYougeAdmin = () => currentUser && currentUser.username === ADMIN_USERNAME;
});

function closeModal() {
  document.getElementById('login-modal').classList.remove('active');
  document.getElementById('modal-username').value = '';
  document.getElementById('modal-password').value = '';
  document.getElementById('modal-confirm-password').value = '';
}

function getBasePath() {
  return location.pathname.includes('/articles/') ? '../' : '';
}