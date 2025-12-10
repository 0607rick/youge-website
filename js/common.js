// js/common.js → 2025.12.07 最終永不閃爍版
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
        <div class="logo-text-with-icon" onclick="location.href='${basePath}index.html'" style="cursor:pointer;display:flex;align-items:center;gap:14px;">
          <span style="font-size:2rem;font-weight:900;color:white;">宥哥</span>
          <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:56px;height:56px;border-radius:20px;border:3px solid rgba(255,255,255,0.3);box-shadow:0 4px 15px rgba(0,0,0,0.25);">
        </div>

        <ul class="nav-links desktop-only">
          <li><a href="${basePath}index.html">首頁</a></li>
          <li><a href="${basePath}about.html">關於我</a></li>
          <li><a href="${basePath}announcement.html">最新公告</a></li>
          <li><a href="${basePath}articles/index.html">文章</a></li>
          <li><a href="${basePath}guestbook.html">留言板</a></li>
          <li><a href="${basePath}vip.html" style="color:#ff0000;font-weight:bold;background:rgba(255,71,87,0.25);padding:0.75rem 1.9rem;border-radius:50px;">限制網站</a></li>
        </ul>

        <div class="admin-control desktop-only">
          ${isLoggedIn 
            ? `<span style="color:white;margin-right:1rem;font-weight:600;">Hi, ${displayName}</span>
               <button class="admin-btn" onclick="firebase.auth().signOut().then(()=>location.reload())">登出</button>`
            : `<button class="admin-btn" onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())">登入</button>`
          }
        </div>

        <div class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div class="mobile-menu-overlay">
        <div class="mobile-menu-sidebar">
          <div class="mobile-menu-header">
            <span style="color:white;font-size:1.8rem;font-weight:600;">選單</span>
            <span class="close-menu">&times;</span>
          </div>
          <ul class="mobile-menu-links">
            <li><a href="${basePath}index.html">首頁</a></li>
            <li><a href="${basePath}about.html">關於我</a></li>
            <li><a href="${basePath}announcement.html">最新公告</a></li>
            <li><a href="${basePath}articles/index.html">文章</a></li>
            <li><a href="${basePath}guestbook.html">留言板</a></li>
            <li><a href="${basePath}vip.html">限制網站</a></li>
          </ul>
          <div class="mobile-admin-control" style="margin-top:2rem;padding-top:1rem;border-top:1px solid #333;">
            ${isLoggedIn 
              ? `<span style="color:white;display:block;margin-bottom:1rem;">Hi, ${displayName}</span>
                 <button class="admin-btn" onclick="firebase.auth().signOut().then(()=>location.reload())" style="width:100%;">登出</button>`
              : `<button class="admin-btn" onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())" style="width:100%;">登入</button>`
            }
          </div>
        </div>
      </div>
    `;

    // 手機漢堡點擊事件
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu');

    hamburger?.addEventListener('click', () => {
      overlay.classList.add('active');
    });

    closeBtn?.addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  };

  auth.onAuthStateChanged(user => {
    renderNavbar(user);
  });
});