// js/common.js → 宥哥宇宙永不翻車版（2025.12.03）
document.addEventListener('DOMContentLoaded', () => {
  const basePath = location.pathname.includes('/articles/') ? '../' : './';

  // Firebase 初始化
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

  // 渲染導覽列
  const renderNavbar = () => {
    const isVip = location.pathname.includes('vip.html');
    document.getElementById('navbar-container').innerHTML = `
      <nav class="navbar">
        <div class="logo-text-with-icon" onclick="location.href='${basePath}index.html'" style="cursor:pointer;display:flex;align-items:center;gap:12px;">
          <span style="font-size:1.9rem;font-weight:900;color:white;">宥哥</span>
          <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:48px;height:48px;border-radius:50%;">
        </div>
        <ul class="nav-links">
          <li><a href="${basePath}index.html">首頁</a></li>
          <li><a href="${basePath}about.html">關於我</a></li>
          <li><a href="${basePath}works.html">作品集</a></li>
          <li><a href="${basePath}articles/index.html">文章</a></li>
          <li><a href="${basePath}guestbook.html">留言板</a></li>
          <li><a href="${basePath}vip.html" style="color:#ff4757;font-weight:bold;background:rgba(255,71,87,0.15);padding:8px 18px;border-radius:12px;">
            限制網站
          </a></li>
        </ul>
        <div class="admin-control">
          <button onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())" class="admin-btn">登入</button>
        </div>
        <div class="hamburger">Menu</div>
      </nav>
    `;

    document.querySelector('.hamburger')?.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('active');
    });
  };

  // 白名單功能
  window.addEmail = async () => {
    const email = document.getElementById('new-email')?.value.trim().toLowerCase();
    if (!email || !email.includes('@')) return alert('Email 格式錯誤！');
    await db.collection("vip-whitelist").doc(email).set({ added: new Date() });
    document.getElementById('new-email').value = '';
    alert('已加入：' + email);
    loadWhitelist();
  };

  window.loadWhitelist = async () => {
    const snap = await db.collection("vip-whitelist").get();
    const list = document.getElementById('whitelist');
    if (!list) return;
    list.innerHTML = snap.empty ? '<p style="color:#ffeb3b;text-align:center;">目前還沒有人喔～</p>' : '';
    snap.forEach(doc => {
      list.innerHTML += `
        <div style="padding:15px;background:rgba(255,255,255,0.2);margin:12px 0;border-radius:15px;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:1.1rem;">${doc.id}</span>
          <button onclick="db.collection('vip-whitelist').doc('${doc.id}').delete().then(loadWhitelist)" 
                  style="background:#e74c3c;color:white;border:none;padding:10px 20px;border-radius:12px;cursor:pointer;font-weight:bold;">移除</button>
        </div>`;
    });
  };

  // 登入狀態監聽
  auth.onAuthStateChanged(user => {
    if (user) {
      const isAdmin = user.email === 'a0930619084@gmail.com' || /宥晟|陳宥晟/.test(user.displayName || '');
      
      if (location.pathname.includes('vip.html')) {
        if (isAdmin) {
          document.getElementById('lock-screen')?.remove();
          document.getElementById('vip-content').style.display = 'block';
          
          // 金光管理區觸發
          setTimeout(() => {
            const link = document.querySelector('a[href*="vip.html"]');
            const panel = document.getElementById('admin-panel');
            if (link && panel) {
              link.onmouseenter = () => panel.classList.add('active');
              link.onmouseleave = panel.onmouseleave = () => {
                setTimeout(() => {
                  if (!panel.matches(':hover')) panel.classList.remove('active');
                }, 300);
              };
              panel.onmouseenter = () => panel.classList.add('active');
            }
            loadWhitelist();
          }, 500);
        } else {
          // 檢查白名單
          db.collection("vip-whitelist").doc(user.email.toLowerCase()).get().then(doc => {
            if (!doc.exists) {
              alert('你還沒被加入白名單喔～快去撒嬌求邀請！');
              auth.signOut();
            } else {
              document.getElementById('lock-screen').style.display = 'none';
              document.getElementById('vip-content').style.display = 'block';
            }
          });
        }
      }
    }
    renderNavbar();
  });

  renderNavbar();
});
