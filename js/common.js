JavaScript// js/common.js → 2025 宥哥宇宙最終手機選單版（三條線 + 側邊滑出）
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

  const renderNavbar = (user) => {
    const displayName = user?.displayName || user?.email?.split('@')[0] || '訪客';
    const isLoggedIn = !!user;

    document.getElementById('navbar-container').innerHTML = `
      <nav class="navbar">
        <!-- LOGO -->
        <div class="logo-text-with-icon" onclick="location.href='${basePath}index.html'" style="cursor:pointer;">
          <span style="font-size:2rem;font-weight:900;color:white;">宥哥</span>
          <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:56px;height:56px;border-radius:20px;border:3px solid rgba(255,255,255,0.3);box-shadow:0 4px 15px rgba(0,0,0,0.25);">
        </div>

        <!-- 電腦版橫向選單 -->
        <ul class="nav-links desktop-only">
          <li><a href="${basePath}index.html">首頁</a></li>
          <li><a href="${basePath}about.html">關於我</a></li>
          <li><a href="${basePath}announcement.html">最新公告</a></li>
          <li><a href="${basePath}articles/index.html">文章</a></li>
          <li><a href="${basePath}guestbook.html">留言板</a></li>
          <li><a href="${basePath}vip.html" class="vip-link">限制網站</a></li>
        </ul>

        <!-- 登入區域 -->
        <div class="admin-control">
          ${isLoggedIn 
            ? `<span style="color:white;margin-right:1rem;font-weight:600;">Hi, ${displayName}</span>
               <button class="admin-btn" onclick="firebase.auth().signOut().then(()=>location.reload())">登出</button>`
            : `<button class="admin-btn" onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())">登入</button>`
          }
        </div>

        <!-- 三條線漢堡圖示 -->
        <div class="hamburger" id="hamburgerBtn">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <!-- 手機側邊滑出選單 -->
      <div class="mobile-menu-overlay" id="mobileMenu">
        <div class="mobile-menu-sidebar">
          <div class="mobile-menu-header">
            <div style="font-size:1.8rem;font-weight:900;color:white;">宥哥宇宙</div>
            <span class="close-menu" id="closeMenu">×</span>
          </div>
          <ul class="mobile-menu-links">
            <li><a href="${basePath}index.html">首頁</a></li>
            <li><a href="${basePath}about.html">關於我</a></li>
            <li><a href="${basePath}announcement.html">最新公告</a></li>
            <li><a href="${basePath}articles/index.html">文章</a></li>
            <li><a href="${basePath}guestbook.html">留言板</a></li>
            <li><a href="${basePath}vip.html" style="color:#ff4757;font-weight:bold;">限制網站</a></li>
            <li><hr style="margin:1.5rem 0;border-color:#444;"></li>
            <li style="color:#aaa;font-size:0.9rem;">
              ${isLoggedIn ? `Hi, ${displayName}｜<a href="javascript:firebase.auth().signOut().then(()=>location.reload())" style="color:#ff4757;">登出</a>` : '<a href="javascript:firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())">登入</a>'}
            </li>
          </ul>
        </div>
      </div>
    `;

    // 綁定漢堡選單事件
    const menu = document.getElementById('mobileMenu');
    const openBtn = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('closeMenu');

    openBtn.addEventListener('click', () => menu.classList.add('active'));
    closeBtn.addEventListener('click', () => menu.classList.remove('active'));
    menu.addEventListener('click', (e) => {
      if (e.target === menu) menu.classList.remove('active');
    });
  };

  // Firebase 登入狀態監聽
  auth.onAuthStateChanged(user => {
    renderNavbar(user);
  });
});