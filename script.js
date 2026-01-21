// ===== 1. 动态星空背景 =====
function initStarfield() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 300;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createStars();
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            // 星星闪烁效果
            star.opacity += star.twinkleSpeed * star.twinkleDirection;
            if (star.opacity > 0.8 || star.opacity < 0.2) {
                star.twinkleDirection *= -1;
            }

            // 绘制星星
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(173, 216, 230, ${star.opacity})`; 
            ctx.fill();

            // 缓慢向下移动
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateStars();
}

// ===== 2. 页面加载完成后执行 =====
document.addEventListener('DOMContentLoaded', function() {
    // 初始化动态星空
    initStarfield();

    // 更新版权年份
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===== 3. 弹窗系统核心逻辑 =====
    const triggers = document.querySelectorAll('.modal-trigger');
    const modals = document.querySelectorAll('.modal');
    const overlay = document.getElementById('modalOverlay');
    const closeButtons = document.querySelectorAll('.close-modal');

    // 点击触发按钮打开弹窗
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 关闭所有弹窗的函数
    function closeAllModals() {
        modals.forEach(modal => modal.classList.remove('active'));
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // 点击关闭按钮或背景关闭弹窗
    closeButtons.forEach(btn => btn.addEventListener('click', closeAllModals));
    overlay.addEventListener('click', closeAllModals);

    // 按ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllModals();
    });

    // ===== 4. 成员查询函数 (支持8人查询与跳转) =====
    window.searchMember = function() {
        const input = document.getElementById('memberSearch').value.trim();
        const resultElement = document.getElementById('searchResult');

        // 完整的8人数据库
        const memberDatabase = {
            '蛊师': {职务: '理事会常委会总书记兼常务副会长', 类别: '核心常委', page: 'gushi.html'},
            '玄窈': {职务: '理事会会长兼常务副书记兼东玄部部长', 类别: '核心常委', page: 'xuanyao.html'},
            '時璟': {职务: '常务副书记、常务副会长、西玄部部长', 类别: '核心常委', page: 'shijing.html'},
            '一叶知秋': {职务: '纪检委书记、人事部部长', 类别: '核心常委', page: 'yiyezhiqiu.html'},
            'PPT': {职务: '宣传部部长兼常委会委员', 类别: '委员会成员', page: 'ppt.html'},
            '雾屿': {职务: '组织部部长兼常务纪委副书记兼常委会委员', 类别: '委员会成员', page: 'wuyu.html'},
            '钱多多': {职务: '人事部成员管理处处长', 类别: '处级干部', page: 'qianduoduo.html'},
            '小碗': {职务: '纪委员会发展改革处处长', 类别: '处级干部', page: 'xiaowan.html'}
        };

        if (!input) {
            resultElement.innerHTML = '<span style="color:#f87171;">请输入查询姓名。</span>';
            return;
        }

        if (memberDatabase[input]) {
            const member = memberDatabase[input];
            resultElement.innerHTML = `<span style="color:#34d399;">
                <strong>“${input}”</strong> 身份验证通过！<br>
                职务：${member.职务}<br>
                人员类别：${member.类别}<br>
                <a href="${member.page}" target="_blank" style="color:#60a5fa; font-weight:bold; text-decoration:underline; display:inline-block; margin-top:6px;">
                    >>> 查看完整人事档案及任命文件 <<<
                </a>
            </span>`;
        } else {
            resultElement.innerHTML = `<span style="color:#f87171;">
                查询结果：“${input}”不在理事会成员名录中。<br>
                （提示：请检查姓名是否输入完整，如：蛊师、玄窈、PPT）
            </span>`;
        }
    };

    // ===== 5. 新闻模块展开/收起功能 =====
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        const header = item.querySelector('.news-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // 关闭所有其他新闻项
            newsItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // 切换当前项
            item.classList.toggle('active', !isActive);
        });
    });

    // ===== 6. 平滑滚动导航 (用于非弹窗链接) =====
    const navLinks = document.querySelectorAll('.main-nav a:not(.modal-trigger)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 控制台趣味输出
    console.log('%c🔮 玄理统研最高理事会 - 虚拟官网 %c\n 星空已点亮，弹窗已修复，一切就绪。', 'color: #60a5fa; font-weight: bold; font-size: 12px;', 'color: #94a3b8;');
});