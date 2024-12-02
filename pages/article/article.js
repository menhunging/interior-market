$(document).ready(function () {
  if ($(".slider-article").length > 0) {
    const sliders = document.querySelectorAll(".slider-article");
    let mySwipers = [];

    function sliderinit() {
      sliders.forEach((slider, index) => {
        if (!slider.swiper) {
          mySwipers[index] = new Swiper(slider, {
            slidesPerView: 4,
            spaceBetween: 32,
            autoHeight: true,
            breakpoints: {
              0: {
                slidesPerView: 1.3,
                spaceBetween: 16,
                grid: {
                  rows: 1,
                  fill: "row",
                },
              },
              639: {
                slidesPerView: 2,
                spaceBetween: 16,
                autoHeight: false,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
              745: {
                slidesPerView: 2,
                grid: {
                  rows: 1,
                  fill: "row",
                },
              },
              850: {
                slidesPerView: 3,
                grid: {
                  rows: 1,
                  fill: "row",
                },
              },
              1200: {
                slidesPerView: 4,
                grid: {
                  rows: 1,
                  fill: "row",
                },
              },
            },
          });
        } else {
          return;
        }
      });
    }

    sliders.length && sliderinit();
  }
});
