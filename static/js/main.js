// PC端全屏滚动逻辑
const pcContainer = document.getElementById('pcContainer');
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.scroll-dots .dot');
const navbar = document.querySelector('.navbar');
const logo = document.querySelector('.section-1 .logo'); // 获取logo元素
let currentSection = 0;
let isScrolling = false;
// 全局变量：标记是否处于加载中状态
let isLoading = true;
// 新增新闻加载状态标记
let isNewsLoaded = false;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', async () => {
    // 初始化logo动画
    const logo = document.querySelector('.section-1 .logo');
    logo.classList.remove('active');
    void logo.offsetHeight;
    logo.classList.add('active');

    // 预加载角色切换图片
    const roleImages = Object.values(roles).map(role => role.horizontal);
    roleImages.forEach(url => {
        const preloadImg = new Image();
        preloadImg.src = url;
    });

    // 预加载新闻
    loadNews();

    // 手动触发初始滚动逻辑，确保页脚显示
    scrollToSection(currentSection);
});

// 新闻加载函数（已调整部分）
async function loadNews() {
    if (isNewsLoaded) return; // 避免重复加载
    
    const newsContent = document.querySelector('.news-content');
    const loadingEl = document.querySelector('.news-loading');
    
    try {
        // 新增：清空现有新闻内容（防止重复加载）
        newsContent.innerHTML = '';
        
        const response = await fetch('https://archive.ovofish.com/api/ui/user/admin/article/article_view.jsp?type=simple&tag=notice&quantity=4');
        const data = await response.json();
        
        loadingEl.style.display = 'none'; // 隐藏加载提示
        data.slice(0, 5).forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            const cleanLink = item.link.replace(/`/g, '').trim();
            newsItem.innerHTML = `
                <h3><a href="${cleanLink}" target="_blank">${item.title}</a></h3>
                <p>${item.pubDate}：${item.description}</p>
            `;
            newsContent.appendChild(newsItem);
        });
        
        isNewsLoaded = true; // 标记已加载
    } catch (error) {
        loadingEl.textContent = '加载失败，请刷新重试';
        console.error('新闻数据加载失败:', error);
    }
}

// 触发新闻项动画（逐个右渐入）
function triggerNewsAnimation() {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('active'); // 逐个添加激活类（间隔100ms）
        }, index * 250); 
    });
}

// 重置新闻项动画（离开时）
function resetNewsAnimation() {
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.classList.remove('active'); // 移除激活类，回到初始状态
    });
}


// 修改滚动逻辑，控制动画触发和重置
function scrollToSection(index) {
    if (isScrolling) return;
    isScrolling = true;
    currentSection = index;
    pcContainer.style.transform = `translateY(-${currentSection * 100}vh)`;
    
    // 更新导航点状态
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSection));

    // 控制导航栏显示/隐藏（仅第一页隐藏）
    navbar.classList.toggle('hidden', currentSection === 0);

    // 控制页脚显示（仅第一页和最后一页）
    const footer = document.querySelector('.footer');
    const isFirstOrLastPage = currentSection === 0 || currentSection === sections.length - 1;
    footer.classList.toggle('active', isFirstOrLastPage);

    // 新增：首页logo动画控制（关键修改）
    // 修改滚动逻辑中的logo动画控制部分
    if (currentSection === 0) {
        // 进入首页时添加active类触发渐入
        logo.classList.add('active');
    } else {
        // 离开首页时移除active类触发渐出
        logo.classList.remove('active');
    }

    // 第二页动画控制（新增装饰图逻辑）
    const roleContainer = document.getElementById('roleContainer');
    const staffDecoration = document.getElementById('staffDecoration'); // 获取装饰图元素
    if (currentSection === 1) {
        setTimeout(() => {
            roleContainer.classList.add('active');
            staffDecoration.classList.add('active'); // 进入第二页时激活动画
        }, 300);
    } else {
        roleContainer.classList.remove('active');
        staffDecoration.classList.remove('active'); // 离开时触发退出动画
    }

    // 第三页（新闻页）逻辑（保留原有动画触发，但数据已预加载）
    if (currentSection === 2) {
        triggerNewsAnimation(); // 进入新闻页时触发动画（数据已预加载）
    } else {
        resetNewsAnimation(); // 离开新闻页时重置动画
    }
    
    // 第三页新闻装饰图逻辑（新增）
    const newsDecoration = document.getElementById('newsDecoration');
    if (currentSection === 2) {
        setTimeout(() => {
            newsDecoration.classList.add('active'); // 延迟300ms激活动画
        }, 300); 
    } else {
        newsDecoration.classList.remove('active');
    }

    setTimeout(() => isScrolling = false, 600);
}

// 鼠标滚轮事件（修改）
window.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 768) return; // 手机端不触发
    if (isLoading || isScrolling) return; // 关键修改：加载中或滚动中时禁止滚动
    const delta = e.deltaY > 0 ? 1 : -1;
    currentSection = Math.max(0, Math.min(sections.length - 1, currentSection + delta));
    scrollToSection(currentSection);
});

// 导航点点击事件（修改）
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isLoading || isScrolling) return; // 关键修改：加载中或滚动中时禁止滚动
        scrollToSection(index);
    });
});

// 角色切换逻辑
const roles = {
    default: {
        name: "Akatsuki Misaki",
        horizontal: "https://static-cos.ovofish.com/static/miraipip/img/XCDK1893.jpg",
        desc: "本站主要运营者，负责网站的运营管理，负责绝大部分功能组件开发，隶属于某个神秘组织，提供图片托管服务，助力萌新站长。",
        githubUrl: "https://github.com/akatsuki-misaki",
        githubText: "GITHUB.COM/Akatsuki-Misaki"
    },
    costume: {
        name: "Yanam1Anna",
        horizontal: "https://static-cos.ovofish.com/static/miraipip/img/2BF88138E5D3FB086F90A0CEB84BC475.jpg",
        desc: "NekoPara在线补丁下载一键包作者，为本站加密鉴权方案提供帮助，本站鉴权组件维护者，作为回礼本站提供校验下载服务，列为本站的合作伙伴。",
        githubUrl: "https://github.com/yanam1anna",
        githubText: "GITHUB.COM/YANAM1ANNA"
    },
    holiday: {
        name: "LiSHang999",
        horizontal: "https://img-bohe.lolicon.team/i/img/img-cdn/tu1.jpg",
        desc: "UI设计者，提供主题色彩以及界面设计建议，为本站提供视觉设计参考，列为本站的合作伙伴。",
        githubUrl: "https://github.com/lishang999",
        githubText: "GITHUB.COM/LiSHang999"
    }
};

document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const role = roles[btn.dataset.role];
        const roleName = document.getElementById('roleName');
        const roleHorizontal = document.getElementById('roleHorizontal');
        const roleDesc = document.getElementById('roleDesc');
        const roleUrlLink = document.querySelector('.role-url a'); // 获取超链接元素

        // 1. 执行渐出动画（包含超链接文字）
        roleName.style.opacity = '0';
        roleHorizontal.style.opacity = '0';
        roleDesc.style.opacity = '0';
        roleUrlLink.style.opacity = '0'; // 新增：超链接文字渐出

        // 2. 等待渐出完成
        setTimeout(() => {
            // 3. 更新内容（包含超链接文字）
            roleName.innerHTML = `<a href="${role.githubUrl}" target="_blank">${role.name}</a>`;
            roleHorizontal.src = role.horizontal;
            roleDesc.innerHTML = role.desc;
            roleUrlLink.href = role.githubUrl;
            roleUrlLink.textContent = role.githubText; // 关键修改：更新文字内容

            // 4. 执行渐入动画（包含超链接文字）
            roleName.style.opacity = '1';
            roleHorizontal.style.opacity = '1';
            roleDesc.style.opacity = '1';
            roleUrlLink.style.opacity = '1'; // 新增：超链接文字渐入
        }, 300);
    });
});

// 页面加载完成后执行加载动画 （已调整部分）
window.onload = function () {
    setTimeout(function () {
        setTimeout(loadingAnime1, 1000);
        setTimeout(loadingAnime2, 2000);
        setTimeout(loadingDisableAnime, 4000);
        setTimeout(loadingDisable, 6000);
    }, 100);
};
function loadingDisableAnime() {
    document.querySelector('#loading').classList.add('disable');
    setTimeout(function () {
        // 新增：加载动画结束后显示页脚
        const footer = document.querySelector('.footer');
        if (footer) {
            // 手动添加active类触发页脚显示（与滚动逻辑兼容）
            footer.classList.add('active');
        }
    }, 500);
}
function loadingDisable() {
    document.querySelector('#loading').style.display = 'none';
    isLoading = false; // 加载完成，允许滚动
}
function loadingAnime1() {
    document.querySelector('#logo').classList.add('logomove');
}
function loadingAnime2() {
    document.querySelector('#RTXT').classList.add('opcy1');
    document.querySelector('#RTXT').classList.remove('opcy0');
    //隐藏页脚
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.classList.remove('active'); // 移除active类
    }
}
function jumppage() {
    window.location.href = '/';
}

// 延迟3s执行
setTimeout(function() { 
    console.log("%c Heartfelt %c", "background-image: linear-gradient(195deg, #169af8 0%, #16e6f8 100%); color:#ffffff", "", "或许这里未来会成为中文互联网为数不多的净土吧");
}, 3000);