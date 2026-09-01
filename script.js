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
      }

      function nextScene() {
        const nextIdx = (currentIndex + 1) % pills.length;
        switchScene(nextIdx);
      }

      function startTimer() {
        stopTimer();
        timer = setInterval(() => {
          if (!isPaused && !document.hidden) {
            nextScene();
          }
        }, 3000);
      }

      function stopTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      // 手动点击切换并重置定时器
      pills.forEach((pill, idx) => {
        pill.addEventListener('click', () => {
          switchScene(idx);
          startTimer();
        });
      });

      // 悬停暂停轮播，移出继续轮播
      if (demoSection) {
        demoSection.addEventListener('mouseenter', () => { isPaused = true; });
        demoSection.addEventListener('mouseleave', () => { isPaused = false; });
      }

      // 启动 3 秒自动轮播
      startTimer();
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
          // 降级处理：保持默认打开 releases 页面
          console.warn("[Download] 自动获取最新安装包失败，使用默认 Releases 页面:", err);
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

    // 9. Download Flow Optimization & 3s Fallback Modal
    (function () {
      const modal = document.getElementById('downloadModal');
      const closeBtn = document.getElementById('closeDlModal');
      const panBtn = document.getElementById('panDownloadBtn');
      const downloadButtons = document.querySelectorAll('.js-download-btn');
      
      let timer = null;

      function openModal() {
        if (modal) {
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        }
      }

      function closeModal() {
        if (modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
        }
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }

      downloadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          // 清除上一次的定时器
          if (timer) clearTimeout(timer);

          // 3 秒内若未完成下载响应则唤起弹层提示
          timer = setTimeout(() => {
            openModal();
          }, 3000);
        });
      });

      // 点击免登录网盘下载直接关闭弹层
      if (panBtn) {
        panBtn.addEventListener('click', () => {
          closeModal();
        });
      }

      // 关闭按钮和遮罩层点击关闭
      if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
      }
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });
      }

      // ESC 键关闭
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
          closeModal();
        }
      });
    })();
