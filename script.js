// 获取进度条相关元素
const loadingProgress = document.getElementById('loading-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// 进度模拟变量
let progress = 0;
let simulateProgress = true;
let resourcesLoaded = 0;
let totalResources = 0;
let isPageLoaded = false;

// 计算页面资源数量
function countPageResources() {
  const images = document.querySelectorAll('img');
  const videos = document.querySelectorAll('video');
  const iframes = document.querySelectorAll('iframe');
  const scripts = document.querySelectorAll('script[src]');
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  return images.length + videos.length + iframes.length + scripts.length + links.length;
}

// 更新进度条
function updateProgress(value, message) {
  progress = Math.min(value, 100);
  progressFill.style.width = progress + '%';
  
  if (message) {
    progressText.textContent = message;
  }
  
  // 当进度达到100%时，显示完成状态
  if (progress >= 100) {
    progressText.textContent = '加载完成！';
    progressText.classList.add('completed');
    
    // 延迟隐藏进度条
    setTimeout(() => {
      loadingProgress.classList.add('hidden');
      
      // 完全移除进度条（可选）
      setTimeout(() => {
        loadingProgress.style.display = 'none';
      }, 500);
    }, 800);
  }
}

// 模拟进度增长
function simulateLoading() {
  if (!simulateProgress) return;
  
  // 初始快速增长
  if (progress < 30) {
    progress += Math.random() * 5 + 1;
    updateProgress(progress, '正在初始化...');
  } 
  // 中期稳步增长
  else if (progress < 70) {
    progress += Math.random() * 3 + 0.5;
    updateProgress(progress, '正在加载资源...');
  }
  // 后期缓慢增长，等待真实加载
  else if (progress < 90) {
    progress += Math.random() * 1 + 0.2;
    updateProgress(progress, '即将完成...');
  }
  
  // 如果没有达到100%，继续模拟
  if (progress < 100) {
    setTimeout(simulateLoading, 200);
  }
}

// 监听资源加载完成
function handleResourceLoad() {
  resourcesLoaded++;
  
  // 计算实际加载进度（基于资源加载比例和模拟进度的混合）
  const actualProgress = 30 + (resourcesLoaded / totalResources) * 40;
  
  // 混合模拟进度和实际进度
  const mixedProgress = Math.max(progress, actualProgress);
  updateProgress(mixedProgress, `正在加载资源 (${resourcesLoaded}/${totalResources})...`);
}

// 监听所有图片加载
function setupResourceLoading() {
  const images = document.querySelectorAll('img');
  const videos = document.querySelectorAll('video');
  
  // 计算总资源数
  totalResources = images.length + videos.length;
  
  // 如果页面没有资源，直接完成
  if (totalResources === 0) {
    simulateProgress = false;
    updateProgress(100, '加载完成！');
    return;
  }
  
  // 监听图片加载
  images.forEach(img => {
    if (img.complete) {
      resourcesLoaded++;
    } else {
      img.addEventListener('load', handleResourceLoad);
      img.addEventListener('error', handleResourceLoad); // 错误也视为加载完成
    }
  });
  
  // 监听视频加载
  videos.forEach(video => {
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
      resourcesLoaded++;
    } else {
      video.addEventListener('loadeddata', handleResourceLoad);
      video.addEventListener('error', handleResourceLoad);
    }
  });
  
  // 初始检查
  if (resourcesLoaded > 0) {
    handleResourceLoad();
  }
}

// 页面加载完成处理
function handlePageLoaded() {
  isPageLoaded = true;
  simulateProgress = false;
  
  // 确保进度达到100%
  setTimeout(() => {
    updateProgress(100, '加载完成！');
  }, 300);
}

// 初始化进度条
function initProgressBar() {
  // 计算资源数量
  setupResourceLoading();
  
  // 开始模拟进度
  setTimeout(simulateLoading, 300);
  
  // 监听页面加载事件
  window.addEventListener('load', handlePageLoaded);
  
  // 设置超时保护（8秒后强制完成）
  setTimeout(() => {
    if (!isPageLoaded) {
      simulateProgress = false;
      updateProgress(100, '加载完成！');
    }
  }, 8000);
}

// 页面加载后初始化进度条
document.addEventListener('DOMContentLoaded', initProgressBar);

// 获取所有成员卡片
const memberCards = document.querySelectorAll('.member-card');

// 为每个卡片添加点击事件
memberCards.forEach(card => {
  card.addEventListener('click', () => {
    // 切换翻转类名
    card.classList.toggle('flipped');
  });
});

// 图片轮播逻辑
const carousels = document.querySelectorAll('.image-carousel');
carousels.forEach(carousel => {
  // 获取该轮播的所有图片路径（从data-images属性解析）
  const images = JSON.parse(carousel.dataset.images);
  let currentIndex = 0; // 当前显示的图片索引
  const imgElement = carousel.querySelector('.carousel-img');
  const counterElement = carousel.querySelector('.carousel-counter');

  // 点击图片切换下一张
  carousel.addEventListener('click', () => {
    // 切换索引（循环：最后一张→第一张）
    currentIndex = (currentIndex + 1) % images.length;
    // 更新图片src
    imgElement.src = images[currentIndex];
    // 更新计数提示（可选）
    counterElement.textContent = `${currentIndex + 1}/${images.length}`;
    // 可选：添加淡入效果
    imgElement.style.opacity = 0;
    setTimeout(() => {
      imgElement.style.opacity = 1;
    }, 50);
  });
});