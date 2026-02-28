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