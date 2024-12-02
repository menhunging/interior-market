$(document).ready(function () {
  if ($(".product-info__slider").length > 0) {
    let swiper = new Swiper(".product-info__slider", {
      slidesPerView: 1,
      pagination: {
        el: ".product-info__picture .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
});
