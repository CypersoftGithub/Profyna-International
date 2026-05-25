document.addEventListener('DOMContentLoaded', function () {
  const sliderEl = document.querySelector('#section-intro .swiper');
  if (!sliderEl || typeof Swiper === 'undefined') return;

  new Swiper(sliderEl, {
    direction: 'horizontal',
    loop: true,
    speed: 900,
    spaceBetween: 0,
    watchSlidesProgress: true,
    observer: true,
    observeParents: true,

    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },

    pagination: {
      el: '#section-intro .swiper-pagination',
      clickable: true
    },

    navigation: {
      nextEl: '#section-intro .swiper-button-next',
      prevEl: '#section-intro .swiper-button-prev'
    }
  });
});