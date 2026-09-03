// 1. Multi-Color Simultaneous Typing Animation
    (function () {
      const words = [
        { text: "截图", elId: "typeWord1", colorClass: "word-capture" },
        { text: "套壳", elId: "typeWord2", colorClass: "word-frame" },
        { text: "水印", elId: "typeWord3", colorClass: "word-watermark" }
      ];

      const el1 = document.getElementById("typeWord1");
      const el2 = document.getElementById("typeWord2");
      const el3 = document.getElementById("typeWord3");
      if (!el1 || !el2 || !el3) return;

      const elements = [el1, el2, el3];

      function clearAll() {
        elements.forEach(el => el.textContent = "");
      }

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function typeSequence() {
        while (true) {
          clearAll();
          await sleep(400);

          // Type Word 1: 截图
          for (let i = 1; i <= words[0].text.length; i++) {
            el1.textContent = words[0].text.substring(0, i);
            await sleep(140);
          }
          await sleep(180);

          // Type Word 2: 套壳
          for (let i = 1; i <= words[1].text.length; i++) {
            el2.textContent = words[1].text.substring(0, i);
            await sleep(140);
          }
          await sleep(180);

          // Type Word 3: 水印
          for (let i = 1; i <= words[2].text.length; i++) {
            el3.textContent = words[2].text.substring(0, i);
            await sleep(140);
          }

          // Keep all 3 words displayed together in vivid distinct colors for 4.5s
          await sleep(4500);

          // Erase all in reverse sequence
          for (let i = words[2].text.length; i >= 0; i--) {
            el3.textContent = words[2].text.substring(0, i);
            await sleep(70);
          }
          for (let i = words[1].text.length; i >= 0; i--) {
            el2.textContent = words[1].text.substring(0, i);
            await sleep(70);
          }
          for (let i = words[0].text.length; i >= 0; i--) {
            el1.textContent = words[0].text.substring(0, i);
            await sleep(70);
          }
          await sleep(500);
        }
      }

      typeSequence();
    })();

    // 2. Mouse-following Spotlight Layer
    window.addEventListener('pointermove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    }, { passive: true });

    // 3. Interactive Hero Scatter Canvas (Pixel Font & Perfectly Aligned Mouse Dynamics)
    (function () {
      const canvas = document.getElementById('hero-scatter');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const CHARS = ["0", "1", "0", "1", "0", "1", "+", "·", "▫", ":"];
      let W = 0, H = 0, cols = 0, rows = 0, grid = [];
      const CELL = 24;
      let mx = -999, my = -999;
      let targetMx = -999, targetMy = -999;

      function resize() {
        const rect = canvas.getBoundingClientRect();
        W = rect.width || canvas.offsetWidth || window.innerWidth;
        H = rect.height || canvas.offsetHeight || 400;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        cols = Math.ceil(W / CELL);
        rows = Math.ceil(H / CELL);
        grid = [];
        for (let r = 0; r < rows; r++) {
          grid[r] = [];
          for (let c = 0; c < cols; c++) {
            grid[r][c] = CHARS[(Math.random() * CHARS.length) | 0];
          }
        }
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.font = '11px "Silkscreen", "Press Start 2P", monospace';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        mx += (targetMx - mx) * 0.15;
        my += (targetMy - my) * 0.15;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * CELL + CELL / 2;
            const y = r * CELL + CELL / 2;

            const dx = x - mx;
            const dy = y - my;
            const mDist = Math.sqrt(dx * dx + dy * dy);

            const cx = x - W / 2;
            const cy = y - H / 2;
            const cDist = Math.sqrt(cx * cx + cy * cy);
            const maxCDist = Math.sqrt(W * W + H * H) * 0.5;
            const baseFade = Math.max(0, 1 - cDist / maxCDist);

            const glow = Math.max(0, 1 - mDist / 160);
            const alpha = baseFade * 0.16 + glow * 0.7;

            if (alpha < 0.02) continue;

            if (glow > 0.08) {
              ctx.fillStyle = `rgba(232, 139, 82, ${Math.min(1, alpha * 1.25).toFixed(3)})`;
            } else {
              ctx.fillStyle = `rgba(241, 245, 249, ${alpha.toFixed(3)})`;
            }
            ctx.fillText(grid[r][c], x, y);
          }
        }
      }

      resize();
      draw();

      window.addEventListener('resize', () => { resize(); draw(); }, { passive: true });

      window.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          targetMx = e.clientX - rect.left;
          targetMy = e.clientY - rect.top;
        } else {
          targetMx = -999;
          targetMy = -999;
        }
      }, { passive: true });

      window.addEventListener('pointerleave', () => {
        targetMx = -999;
        targetMy = -999;
      });

      let isVisible = true;
      const obs = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0 });
      const hero = document.getElementById('hero');
      if (hero) obs.observe(hero);

      function loop() {
        if (isVisible && !document.hidden) {
          draw();
        }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);

      setInterval(() => {
        if (!isVisible || document.hidden) return;
        const count = ((rows * cols * 0.05) | 0) + 1;
        for (let i = 0; i < count; i++) {
          const rr = (Math.random() * rows) | 0;
          const cc = (Math.random() * cols) | 0;
          if (grid[rr]) grid[rr][cc] = CHARS[(Math.random() * CHARS.length) | 0];
        }
      }, 140);
    })();

    // 4. Navbar scroll effect
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // 5. Scene Switcher & 3-Second Auto Carousel (4 Scenes: 基础截图 / 连续截图 / 自动套壳 / 自动水印)
    (function () {
      const pills = document.querySelectorAll('.scene-pill');
      const layers = document.querySelectorAll('.scene-layer');
      const titleEl = document.getElementById('scene-title');
      const descEl = document.getElementById('scene-desc');
      const demoSection = document.querySelector('.demo-section');
      
      let currentIndex = 0;
      let timer = null;
      let isPaused = false;

      const SCENE_DURATION = 3600; // 每个场景播放 3.6 秒
      let progressTimer = null;
      let startTime = Date.now();
      let elapsedPaused = 0;

      function resetAllProgressBars() {
        pills.forEach(p => {
          const bar = p.querySelector('.progress-bar');
          if (bar) bar.style.width = '0%';
        });
      }

      function updateActiveProgressBar(percent) {
        const currentPill = pills[currentIndex];
        if (currentPill) {
          const bar = currentPill.querySelector('.progress-bar');
          if (bar) bar.style.width = Math.min(100, Math.max(0, percent)) + '%';
        }
      }

      function switchScene(index) {
        if (index < 0 || index >= pills.length) return;
        currentIndex = index;

        pills.forEach((p, idx) => p.classList.toggle('active', idx === index));
        layers.forEach(l => l.classList.remove('active'));

        const targetPill = pills[index];
        const targetId = targetPill.getAttribute('data-target');
        const targetLayer = document.getElementById(targetId);
        if (targetLayer) targetLayer.classList.add('active');

        if (titleEl) titleEl.textContent = targetPill.getAttribute('data-title');
        if (descEl) descEl.textContent = targetPill.getAttribute('data-desc');

        resetAllProgressBars();
        startTime = Date.now();
        elapsedPaused = 0;
      }

      function nextScene() {
        const nextIdx = (currentIndex + 1) % pills.length;
        switchScene(nextIdx);
      }

      function startProgressLoop() {
        stopProgressLoop();
        startTime = Date.now() - elapsedPaused;

        progressTimer = setInterval(() => {
          if (!isPaused && !document.hidden) {
            const elapsed = Date.now() - startTime;
            const percent = (elapsed / SCENE_DURATION) * 100;
            updateActiveProgressBar(percent);

            if (elapsed >= SCENE_DURATION) {
              nextScene();
            }
          } else if (isPaused) {
            elapsedPaused = Date.now() - startTime;
          }
        }, 30);
      }

      function stopProgressLoop() {
        if (progressTimer) {
          clearInterval(progressTimer);
          progressTimer = null;
        }
      }

      // 手动点击切换并重置进度条
      pills.forEach((pill, idx) => {
        pill.addEventListener('click', () => {
          switchScene(idx);
          startProgressLoop();
        });
      });

      // 悬停暂停进度条，移出恢复充能
      if (demoSection) {
        demoSection.addEventListener('mouseenter', () => { 
          isPaused = true; 
        });
        demoSection.addEventListener('mouseleave', () => { 
          isPaused = false; 
          startTime = Date.now() - elapsedPaused;
        });
      }

      // 启动 Story 进度条充能轮播
      switchScene(0);
      startProgressLoop();
    })();

    // 6. Demo Stage Trio Zoom & Watermark Modes (Scene 3 Trio Showcase & Scene 4 Watermark)
    (function () {
      // Scene 3: Trio Cards Hover / Click / Auto Zoom Focus
      const trioCards = document.querySelectorAll('.trio-card');
      let trioIndex = 1; // 默认 MacBook (主展示位)
      let autoFocusTimer = null;

      function setFocusCard(targetCard) {
        trioCards.forEach(card => card.classList.remove('active'));
        if (targetCard) targetCard.classList.add('active');
      }

      if (trioCards.length) {
        trioCards.forEach((card, idx) => {
          card.addEventListener('mouseenter', () => {
            trioIndex = idx;
            setFocusCard(card);
          });
          card.addEventListener('click', () => {
            trioIndex = idx;
            setFocusCard(card);
          });
        });

        // 场景激活时轮流放大聚焦各个设备
        autoFocusTimer = setInterval(() => {
          const autoframingLayer = document.getElementById('layer-autoframing');
          if (autoframingLayer && autoframingLayer.classList.contains('active') && !document.hidden) {
            trioIndex = (trioIndex + 1) % trioCards.length;
            setFocusCard(trioCards[trioIndex]);
          }
        }, 2200);
      }

      // Scene 4: Watermark Mode Pure Automated Smooth Transition
      const cornerBadge = document.getElementById('wmCornerBadge');
      const tileLayer = document.getElementById('wmTileLayer');
      const modeTag = document.getElementById('wmCurrentModeTag');
      let isCornerMode = true;

      if (cornerBadge && tileLayer) {
        setInterval(() => {
          const watermarkLayer = document.getElementById('layer-autowatermark');
          if (watermarkLayer && watermarkLayer.classList.contains('active') && !document.hidden) {
            isCornerMode = !isCornerMode;
            if (isCornerMode) {
              cornerBadge.classList.add('active');
              tileLayer.classList.remove('active');
              if (modeTag) {
                modeTag.innerHTML = '<span class="wm-pulse-dot">●</span> 模式 A：右下角品牌签名';
                modeTag.style.color = 'var(--cyan)';
                modeTag.style.borderColor = 'rgba(125, 211, 252, 0.25)';
                modeTag.style.background = 'rgba(125, 211, 252, 0.12)';
              }
            } else {
              tileLayer.classList.add('active');
              cornerBadge.classList.remove('active');
              if (modeTag) {
                modeTag.innerHTML = '<span class="wm-pulse-dot" style="color:var(--red);">●</span> 模式 B：45° 全图平铺防伪';
                modeTag.style.color = '#f87171';
                modeTag.style.borderColor = 'rgba(248, 113, 113, 0.25)';
                modeTag.style.background = 'rgba(248, 113, 113, 0.12)';
              }
            }
          }
        }, 2200);
      }
    })();

    // 7. Auto Fetch Latest macOS Installer from GitHub Releases
    (function () {
      const repo = "Starydesigner/ShotMock";
      const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;

      fetch(apiUrl)
        .then(response => {
          if (!response.ok) throw new Error("Release API error: " + response.status);
          return response.json();
        })
        .then(release => {
          if (!release || !Array.isArray(release.assets)) return;

          // 优先寻找 .dmg，其次寻找 .zip 或 .pkg
          const macAsset = release.assets.find(a => a.name && a.name.toLowerCase().endsWith('.dmg'))
            || release.assets.find(a => a.name && (a.name.toLowerCase().endsWith('.zip') || a.name.toLowerCase().endsWith('.pkg')));

          if (macAsset && macAsset.browser_download_url) {
            const downloadButtons = document.querySelectorAll('.js-download-btn');
            const releaseInfo = release.name || release.tag_name || "最新版本";
            
            downloadButtons.forEach(btn => {
              btn.href = macAsset.browser_download_url;
              btn.setAttribute('download', macAsset.name);
              btn.title = `点击直接下载 ${releaseInfo} (${macAsset.name})`;
            });
            console.log(`[Download] 成功获取最新 macOS 安装包: ${macAsset.name}`);
          }
        })
        .catch(err => {
          console.warn("[Download] 自动获取最新安装包失败:", err);
        });
    })();

    // 8. FAQ Accordion & Copy Helper
    (function () {
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (item.classList.contains('active') && answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }

        if (questionBtn && answer) {
          questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (isActive) {
              item.classList.remove('active');
              answer.style.maxHeight = '0px';
            } else {
              item.classList.add('active');
              answer.style.maxHeight = answer.scrollHeight + 'px';
            }
          });
        }
      });

      // 视口尺寸变化（如移动端横竖屏切换或窗口缩放）时重新计算已展开答案高度
      window.addEventListener('resize', () => {
        faqItems.forEach(item => {
          if (item.classList.contains('active')) {
            const answer = item.querySelector('.faq-answer');
            if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      }, { passive: true });
    })();

    function copyFaqCmd(btn, text) {
      navigator.clipboard.writeText(text).then(() => {
        const originText = btn.textContent;
        btn.textContent = "COPIED";
        btn.style.color = "#4ade80";
        setTimeout(() => {
          btn.textContent = originText;
          btn.style.color = "";
        }, 2000);
      });
    }

    // 9. Coffee Sponsor Modal Open/Close Logic
    (function () {
      const openBtn = document.getElementById('btnOpenCoffee');
      const modal = document.getElementById('coffeeModal');
      const closeBtn = document.getElementById('closeCoffeeModal');

      function openCoffeeModal() {
        if (modal) {
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeCoffeeModal() {
        if (modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }

      if (openBtn) {
        openBtn.addEventListener('click', openCoffeeModal);
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', closeCoffeeModal);
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeCoffeeModal();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
          closeCoffeeModal();
        }
      });
    })();
