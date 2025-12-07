// js/common.js → 宥哥宇宙 2025.12.04 最終無敵版（專治「登入後還是顯示登入」）
document.addEventListener('DOMContentLoaded', () => {
  const basePath = location.pathname.includes('/articles/') ? '../' : './';

  firebase.initializeApp({
    apiKey: "AIzaSyBzB_8ZZ3kIpg8ddVBDRe4geiq2GteqDCM",
    authDomain: "youge-website.firebaseapp.com",
    projectId: "youge-website",
    storageBucket: "youge-website.firebasestorage.app",
    messagingSenderId: "971937745820",
    appId: "1:971937745820:web:507bada24a2c8784625659"
  });

  const auth = firebase.auth();
  const db = firebase.firestore();

  // 渲染導覽列（重點修復版）
  const renderNavbar = (user) => {
    const displayName = user?.displayName || user?.email?.split('@')[0] || '訪客';
    const isLoggedIn = !!user;

    document.getElementById('navbar-container').innerHTML = `
      <nav class="navbar">
        <div class="logo-text-with-icon" onclick="location.href='${basePath}index.html'" style="cursor:pointer;display:flex;align-items:center;gap:14px;">
          <span style="font-size:2rem;font-weight:900;color:white;">宥哥</span>
          <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:48px;height:48px;border-radius:50%;">
        </div>

        <ul class="nav-links">
          <li><a href="${basePath}index.html">首頁</a></li>
          <li><a href="${basePath}about.html">關於我</a></li>
          <li><a href="${basePath}works.html">作品集</a></li>
          <li><a href="${basePath}articles/index.html">文章</a></li>
          <li><a href="${basePath}guestbook.html">留言板</a></li>
          <li><a href="${basePath}vip.html" style="color:#ff4757;font-weight:bold;background:rgba(255,71,87,0.25);padding:0.75rem 1.9rem;border-radius:50px;">限制網站</a></li>
        </ul>

        <div class="admin-control">
          ${isLoggedIn ? 
            `<span style="color:white;margin-right:1rem;font-weight:600;">Hi, ${displayName}</span>
             <button class="admin-btn" onclick="firebase.auth().signOut()">登出</button>` 
            : 
            `<button class="admin-btn" onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())">登入</button>`
          }
        </div>

        <div class="hamburger">Menu</div>
      </nav>
    `;

    // 手機選單
    document.querySelector('.hamburger')?.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('active');
    });
  };


  // 關鍵修復：用 setTimeout 強制等 Firebase 真的準備好
  const tryRender = () => {
    const user = auth.currentUser;
    if (user) {
      renderNavbar(user);
      console.log('強制更新成功：', user.email);
    } else {
      // 還沒準備好？再等 500ms
      setTimeout(tryRender, 500);
    }
  };

  // 主要監聽（這行一定要有！）
  auth.onAuthStateChanged(user => {
    console.log('onAuthStateChanged 觸發：', user ? user.email : '未登入');
    renderNavbar(user);
  });

  // 登出按鈕加上強制刷新
  window.signOutAndReload = () => {
    auth.signOut().then(() => location.reload());
  };

  // 保險起見：最多等 5 秒強制更新一次
  setTimeout(tryRender, 1000);
  setTimeout(tryRender, 3000);
  setTimeout(tryRender, 5000);
});
