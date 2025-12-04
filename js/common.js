// js/common.js → 宥哥宇宙 2025 最終永不翻車版（專為 Firebase v10.8.1 compat 打造）
document.addEventListener('DOMContentLoaded', () => {
  const basePath = location.pathname.includes('/articles/') ? '../' : './';

  // 正確初始化 Firebase v10 compat
  const app = firebase.initializeApp({
    apiKey: "AIzaSyBzB_8ZZ3kIpg8ddVBDRe4geiq2GteqDCM",
    authDomain: "youge-website.firebaseapp.com",
    projectId: "youge-website",
    storageBucket: "youge-website.firebasestorage.app",
    messagingSenderId: "971937745820",
    appId: "1:971937745820:web:507bada24a2c8784625659"
  });

  const auth = firebase.auth();
  const db = firebase.firestore();

  // 強制渲染導覽列（不管有沒有登入都要先顯示！）
  const renderNavbar = (user = null) => {
    const displayName = user?.displayName || user?.email?.split('@')[0] || '訪客';
    const isLoggedIn = !!user;

    document.getElementById('navbar-container').innerHTML = `
      <nav class="navbar" style="position:fixed;top:0;left:0;right:0;height:80px;background:linear-gradient(135deg,#6e8efb,#a777e2);display:flex;align-items:center;justify-content:space-between;padding:0 5%;box-shadow:0 8px 30px rgba(0,0,0,0.2);z-index:999;backdrop-filter:blur(12px);">
        
        <!-- 左邊 LOGO -->
        <div onclick="location.href='${basePath}index.html'" style="cursor:pointer;display:flex;align-items:center;gap:14px;">
          <span style="font-size:2rem;font-weight:900;color:white;">宥哥</span>
          <img src="${basePath}assets/images/logo.png" alt="LOGO" style="width:48px;height:48px;border-radius:50%;">
        </div>

        <!-- 中間選單（靠右） -->
        <ul style="display:flex;gap:3rem;list-style:none;margin-left:auto;margin-right:2.5rem;align-items:center;">
          <li><a href="${basePath}index.html" style="color:white;text-decoration:none;font-weight:600;font-size:1.15rem;position:relative;">首頁</a></li>
          <li><a href="${basePath}about.html" style="color:white;text-decoration:none;font-weight:600;font-size:1.15rem;position:relative;">關於我</a></li>
          <li><a href="${basePath}works.html" style="color:white;text-decoration:none;font-weight:600;font-size:1.15rem;position:relative;">作品集</a></li>
          <li><a href="${basePath}articles/index.html" style="color:white;text-decoration:none;font-weight:600;font-size:1.15rem;position:relative;">文章</a></li>
          <li><a href="${basePath}guestbook.html" style="color:white;text-decoration:none;font-weight:600;font-size:1.15rem;position:relative;">留言板</a></li>
          <li><a href="${basePath}vip.html" style="color:#ff4757;font-weight:bold;background:rgba(255,71,87,0.25);padding:0.75rem 1.9rem;border-radius:50px;text-decoration:none;">限制網站</a></li>
        </ul>

        <!-- 右邊登入/登出 -->
        <div style="display:flex;align-items:center;gap:1rem;">
          ${isLoggedIn ? 
            `<span style="color:white;font-weight:600;">Hi, ${displayName}</span>
             <button onclick="firebase.auth().signOut()" style="background:rgba(255,255,255,0.25);color:white;border:none;padding:0.75rem 2rem;border-radius:50px;font-weight:600;cursor:pointer;">登出</button>` 
            : 
            `<button onclick="firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())" style="background:rgba(255,255,255,0.25);color:white;border:none;padding:0.75rem 2rem;border-radius:50px;font-weight:600;cursor:pointer;">登入</button>`
          }
        </div>

        <!-- 手機漢堡 -->
        <div onclick="document.querySelector('ul').style.cssText+='position:fixed;top:80px;left:0;right:0;background:rgba(110,142,251,0.98);flex-direction:column;padding:2rem;gap:1.5rem;text-align:center;'" style="display:none;color:white;font-size:1.8rem;cursor:pointer;" class="hamburger">Menu</div>
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

