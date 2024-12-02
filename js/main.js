let positionMobileBtnFilter = null; // переменная для кнопки вызова фильтра
let positionAnchorFixed = null;
let responsive1199 = 1199;
let responsive1023 = 1023;
let responsive739 = 739;
let responsive639 = 639;
let responsive374 = 374;
let mount = false;

var VIDEO_ID = null; // для запуска видео с ютуба
let filterTags = null; // для тегов в брендах и блоге

let observerPlayVideo = () => {};

let observerPausedVideo = () => {};

addEventListener("scroll", (event) => {
  currentScroll = $(window).scrollTop();

  // console.log("currentScroll", currentScroll);

  if (currentScroll > 200) {
    $(".header").addClass("fixed");
    $(".main").addClass("headerFixed");
  } else {
    $(".header").removeClass("fixed");
    $(".main").removeClass("headerFixed");
  }

  if ($(window).width() <= responsive1199) {
    if ($(".mobile-filter").length > 0) {
      fixedMobileBtnFilter();
    }
  }

  fixedAnchor();

  if (!mount) {
    if ($(".product-info").length > 0 && $(".video-section").length > 0) {
      let position = $(".video-section").offset().top - 800;
      let btn = $(".video-section .video__btn--play");

      if (currentScroll >= position) {
        closeVideoPoster(btn.parents(".video"));

        observerPlayVideo();

        // btn.hasClass("paused") ? observerPlayVideo() : observerPausedVideo();

        mount = true;
      }
    }
  }
});

$(document).ready(function () {
  if ($("[data-fancybox]").length > 0) {
    Fancybox.bind("[data-fancybox]", {
      speedIn: 600,
      speedOut: 600,
      on: {
        reveal: (fancybox, slide) => {
          $(".fancybox__html5video").attr("type", "video/mp4");
          openFullscreen($(".fancybox__html5video")[0]);
        },
      },
    });

    function openFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }
  }

  if ($(".burger").length > 0) {
    let menuInvis = $(".menu-invis");
    let body = $("body");
    let overlay = $(".menu-overlay");

    $(".burger").on("click", function () {
      if (menuInvis.hasClass("opened")) {
        menuInvis.removeClass("opened");
        body.removeClass("hidden");
        overlay.removeClass("opened");
        $(document).off("mouseup");
      } else {
        menuInvis.addClass("opened");
        body.addClass("hidden");
        overlay.addClass("opened");

        $(document).mouseup(function (e) {
          if (
            !menuInvis.is(e.target) &&
            menuInvis.has(e.target).length === 0 &&
            !$(".burger").is(e.target)
          ) {
            body.removeClass("hidden");
            overlay.removeClass("opened");
            menuInvis.removeClass("opened");
            $(document).off("mouseup");
          }
        });
      }
    });
  }

  if ($(".thisYear").length > 0) {
    let date = new Date();
    $(".thisYear").text(date.getFullYear());
  }

  if ($(".footer").length > 0) {
    if ($(window).width() <= responsive1199) {
      initAccardeon(".footer");
    }
  }

  if ($(".product-info__details").length > 0) {
    initAccardeon(".product-info__details");
  }

  if ($(".video").length > 0) {
    $(".video__btn--full").on("click", function () {
      if ($(this).parents(".video").find("video").length > 0) {
        let elem = $(this).parents(".video").find("video")[0];
        openFullVideo(elem);
      }
    });

    if (!$(".video-iframe").length > 0) {
      $(".video__btn--volume").on("click", function () {
        if ($(this).parents(".video").find("video").length > 0) {
          let elem = $(this).parents(".video").find("video");
          let isMuted = elem.prop("muted");
          elem.prop("muted", !isMuted);

          $(this).toggleClass("mute");
        }
      });
    }

    $(".video__btn--play").on("click", function () {
      let self = $(this);

      if ($(this).parents(".video").find("video").length > 0) {
        let elem = $(this).parents(".video").find("video");
        self.toggleClass("paused");
        $(this).parents(".video").toggleClass("play");
        self.hasClass("paused") ? elem.trigger("play") : elem.trigger("pause");
      }
    });

    $(".video__btn--play").map(function () {
      let sefl = $(this);

      if (sefl.parents(".video").find("video").length > 0) {
        let elem = sefl.parents(".video").find("video");
        sefl.toggleClass("paused");
        sefl.parents(".video").toggleClass("play");
        sefl.hasClass("paused") ? elem.trigger("play") : elem.trigger("pause");
      }
    });
  }

  if ($(".video-iframe").length > 0) {
    let src = $(".video-iframe").attr("data-src");
    VIDEO_ID = src.split("embed/").pop();
  }

  if ($(".products__slider").length > 0) {
    const sliders = document.querySelectorAll(".products__slider");
    let mySwipers = [];

    function sliderinit() {
      sliders.forEach((slider, index) => {
        if (!slider.swiper) {
          mySwipers[index] = new Swiper(slider, {
            slidesPerView: 4,
            spaceBetween: 32,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            on: {
              init: function (swiper) {},
              slideChange: function (swiper) {},
            },
            breakpoints: {
              320: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
              350: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              740: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 4,
              },
              1441: {
                slidesPerView: 4.68,
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

  if ($("select:not(.select-tags)").length > 0) {
    $("select").map(function () {
      $(this).selectric({
        onOpen: function (element) {},
        onChange: function (element) {
          if ($(element).attr("id") == "product-count") {
            window.location.href = $(this).val();
          }
        },
        onClose: function (element) {},
      });
    });
  }

  if ($(".catalog-collections").length > 0) {
    initCollection($(".catalog-collections"));
  }

  if ($(".caterogy-title").length > 0) {
    if ($(window).width() <= responsive1199) {
      wrapText("mobile");
    } else {
      wrapText("desktop");
    }
  }

  if ($(".mobile-filter").length > 0) {
    positionMobileBtnFilter = getPositionBtnFilter($(".mobile-filter"));

    $(".mobile-filter").on("click", function () {
      let section = $(".filter-section");
      let catalogLeft = $(".catalog__leftSide");
      let body = $("body");

      if (section.hasClass("opened")) {
        section.removeClass("opened");
        catalogLeft.removeClass("overlay");
        body.removeClass("hidden");
      } else {
        section.addClass("opened");
        catalogLeft.addClass("overlay");
        body.addClass("hidden");

        $(document).mouseup(function (e) {
          if (
            !section.is(e.target) &&
            section.has(e.target).length === 0 &&
            !$(".mobile-filter").is(e.target)
          ) {
            section.removeClass("opened");
            catalogLeft.removeClass("overlay");
            body.removeClass("hidden");
            $(document).off("mouseup");
          }
        });
      }
    });
  }

  if ($(".article-anchor").length > 0) {
    let sections = $(".step-text");

    let posSection = [];

    positionAnchorFixed =
      $(".article-anchor").offset().top + $(".article-anchor").height();

    sections.each(function (i, el) {
      posSection.push({
        id: $(el).attr("id"),
        pos: $(el).offset().top - 150,
      });
    });

    $(".article-anchor a").on("click", function (event) {
      event.preventDefault();

      let id = $(this).attr("href");
      let top = $(id).offset().top - 80;

      console.log(id);

      $("body,html").animate({ scrollTop: top }, 300);
    });

    $(window).scroll(function () {
      sections.each(function (i, el) {
        let top = $(el).offset().top;
        let bottom = top + $(el).height();
        let scroll = $(window).scrollTop();
        let id = $(el).attr("id");

        if (scroll > top && scroll < bottom) {
          $(".article-anchor a.active").removeClass("active");
          $('.article-anchor a[href="#' + id + '"]').addClass("active");
        }
      });
    });
  }

  if ($(".phone-input").length > 0) {
    $(".phone-input").map(function () {
      $(this).inputmask({
        mask: "+7(999) 999-99-99",
        placeholder: "*",
        showMaskOnHover: false,
        showMaskOnFocus: true,
        clearIncomplete: true,
      });
    });
  }

  if ($(".btn-basket").length > 0) {
    let basketInvis = $(".basket-invis");
    let menuInvis = $(".menu-invis");
    let body = $("body");
    let overlay = $(".menu-overlay");

    $(".btn-basket").on("click", function () {
      $(document).off("mouseup");

      if (basketInvis.hasClass("opened")) {
        basketInvis.removeClass("opened");
      } else {
        menuInvis.removeClass("opened");
        basketInvis.addClass("opened");
        body.removeClass("hidden");
        overlay.removeClass("opened");

        $(document).mouseup(function (e) {
          if (
            !basketInvis.is(e.target) &&
            basketInvis.has(e.target).length === 0 &&
            !$(".btn-basket").is(e.target)
          ) {
            basketInvis.removeClass("opened");
            $(document).off("mouseup");
          }
        });
      }
    });
  }

  if ($(".btn-search").length > 0) {
    let searchInvis = $(".search-invis");

    $(document).off("mouseup");

    $(".btn-search").on("click", function () {
      if (searchInvis.hasClass("opened")) {
        searchInvis.removeClass("opened");
      } else {
        searchInvis.addClass("opened");

        $(".search-invis").find("input").eq(0).focus();

        $(document).mouseup(function (e) {
          if (
            !searchInvis.is(e.target) &&
            searchInvis.has(e.target).length === 0 &&
            !$(".btn-search").is(e.target)
          ) {
            searchInvis.removeClass("opened");
            $(document).off("mouseup");
          }
        });
      }
    });
  }

  if ($(".slider-caterogy").length > 0) {
    const sliders = document.querySelectorAll(".slider-caterogy");
    let mySwipers = [];

    function sliderinit() {
      sliders.forEach((slider, index) => {
        if (!slider.swiper) {
          mySwipers[index] = new Swiper(slider, {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 32,
            pagination: {
              el: ".swiper-pagination",
              type: "fraction",
              formatFractionCurrent: function (number) {
                return number;
              },
            },
            breakpoints: {
              320: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 16,
              },
              744: {
                slidesPerView: 2,
                slidesPerGroup: 2,
              },
              850: {
                slidesPerView: 3,
                slidesPerGroup: 3,
              },
              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
              },
              1441: {
                slidesPerView: 4.68,
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

  if ($(".slider-caterogy--video").length > 0) {
    if ($(window).width() < 740) {
      initMobileHover();
    } else {
      initDesktopHover();
    }

    $(window).on("resize", function () {
      if ($(window).width() < 740) {
        initMobileHover();
        console.log("mobile");
      } else {
        initDesktopHover();
      }
    });

    function initDesktopHover() {
      if (!$(".slider-caterogy--video").hasClass("init-desktop")) {
        $(".slider-caterogy--video").addClass("init-desktop");
        $(".slider-caterogy--video .swiper-slide").hover(
          function () {
            $(this).find(".video")[0]?.play();
          },
          function () {
            $(this).find(".video")[0]?.pause();
          }
        );
      }
    }

    function initMobileHover() {
      if ($(".slider-caterogy--video").hasClass("init-desktop")) {
        $(".slider-caterogy--video").removeClass("init-desktop");
        $(".slider-caterogy--video .swiper-slide").off("hover");
      }
    }
  }

  if ($(".slider-about-picture").length > 0) {
    const sliders = document.querySelectorAll(".slider-about-picture");
    let mySwipers = [];

    function sliderinit() {
      sliders.forEach((slider, index) => {
        if (!slider.swiper) {
          mySwipers[index] = new Swiper(slider, {
            slidesPerView: 1,
            autoHeight: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
          });
        } else {
          return;
        }
      });
    }

    sliders.length && sliderinit();
  }

  if ($(".menu-invis").length > 0) {
    let links = $(".menu-invis .menu-link");

    links.map(function () {
      if ($(this).next("ul").length === 0) {
        $(this).addClass("not-arrow");
      } else {
        $(this).removeAttr("href");
      }
    });

    links.on("click", function (event) {
      if (!$(this).hasClass("not-arrow")) {
        event.preventDefault();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).next("ul").slideUp();
        } else {
          close($(this));
          $(this).addClass("active");
          $(this).next("ul").slideDown();
        }
      }
    });

    function close(block) {
      let parentLinks = block.closest("ul").find(".menu-link");

      parentLinks.removeClass("active");
      parentLinks.next("ul").slideUp();
    }
  }

  if ($(".filter-section").length > 0) {
    let filterHead = $(".filter-head");

    filterHead.on("click", function (event) {
      event.preventDefault();

      if ($(this).hasClass("opened")) {
        $(this).removeClass("opened");
        $(this).next(".filter-body").slideUp();
      } else {
        // close();
        $(this).addClass("opened");
        $(this).next(".filter-body").slideDown();
      }
    });

    function close() {
      $(".filter-body").slideUp();
      filterHead.removeClass("opened");
    }
  }

  if ($(".check-list").length > 0) {
    $(".check-list").map(function () {
      if ($(this).find(".check-block").length >= 8) {
        $(this).addClass("scroll");
      }
    });
  }

  if ($(".filter-section").length > 0) {
    initFilterSort();
  }

  if ($(".catalog-new__slider").length > 0) {
    const sliders = document.querySelectorAll(".catalog-new__slider");
    let mySwipers = [];

    function sliderinit() {
      sliders.forEach((slider, index) => {
        if (!slider.swiper) {
          mySwipers[index] = new Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 16,
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            pagination: {
              el: ".swiper-pagination",
            },
          });
        } else {
          return;
        }
      });
    }

    sliders.length && sliderinit();
  }

  if ($(".filter-menu--category").length > 0) {
    $(".filter-menu--category .link__arrow").on("click", function () {
      let self = $(this);
      let sub = self.parents("li").find(".filter-sub");

      if (self.hasClass("active")) {
        self.removeClass("active");
        sub.stop().slideUp();
      } else {
        close();
        self.addClass("active");
        sub.stop().slideDown();
      }
    });

    function close() {
      $(".filter-menu--category .link__arrow").removeClass("active");
      $(".filter-menu--category .filter-sub").slideUp();
    }
  }

  if ($(".vacancy-list").length > 0) {
    $(".vacancy-item__head").on("click", function () {
      let parents = $(this)
        .parents(".vacancy-item")
        .find(".vacancy-item__body");

      if ($(this).hasClass("opened")) {
        $(this).removeClass("opened");
        parents.slideUp();
      } else {
        $(this).addClass("opened");
        parents.slideDown();
      }
    });
  }

  if ($(".orders-list").length > 0) {
    $(".orders-item__head").on("click", function () {
      let self = $(this);
      let parents = self.parents(".orders-item");

      if (self.hasClass("opened")) {
        self.removeClass("opened");
        parents.find(".orders-item__body").stop().slideUp();
      } else {
        self.addClass("opened");
        parents.find(".orders-item__body").stop().slideDown();
      }
    });
  }

  if ($(".modal").length > 0) {
    MicroModal.init({
      openTrigger: "data-modal",
      disableScroll: true,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,

      onShow: () => {
        $("body").addClass("modal-open");
      },

      onClose: () => {
        $("body").removeClass("modal-open");
      },
    });

    $("[data-modal]").map(function () {
      $(this).click((e) => {
        e.preventDefault();
        $("body").addClass("modal-open");
      });
    });

    $("[data-micromodal-close]").map(function () {
      $(this).click((e) => {
        //        e.preventDefault();
        if ($(this).attr("data-modal")) {
          setTimeout(() => {
            $("body").addClass("modal-open");
          }, 0.1);
        }
      });
    });
  }

  if ($(".code-inputs__inputs").length > 0) {
    $(".code-inputs__inputs").map(function () {
      let countInput = $(this).find("input");

      $(countInput).on("input", function () {
        if ($(this).val() != "") {
          if ($(this).next("input")) {
            $(this).next("input").focus();
          }
        }
      });
    });

    $('input[type="number"][maxlength]').on("input", function () {
      if (this.value.length > this.maxLength) {
        this.value = this.value.slice(0, this.maxLength);
      }
    });
  }

  if ($(".article-anchor ul").length > 0) {
    $(".article-anchor ul").wrapAll($("<div class='block-blur'></div>"));
  }

  if ($(".article-anchor ul").length > 0) {
    let timer = null;

    if ($(".article-anchor__inner").length) {
      const simpleBar = new SimpleBar($(".article-anchor__inner")[0], {
        classNames: { contentWrapper: "dragscroll" },
      });
      dragscroll.reset();

      let dragscrollBlock = $(".article-anchor__inner").find(".dragscroll");

      simpleBar.getScrollElement().addEventListener("scroll", function () {
        clearTimeout(timer);
        dragscrollBlock.addClass("scroll");

        timer = setTimeout(function () {
          dragscrollBlock.removeClass("scroll");
        }, 300);
      });
    }
  }

  if ($(".select-block").length > 0) {
    $(".select-block").map(function () {
      let block = $(this);

      block.on("click", function () {
        let list = block.find(".select-block__list");

        if (!block.hasClass("opened")) {
          $(".select-block__list").stop().slideUp(0);
          list.stop().slideDown(0);
        } else {
          $(".select-block__list").stop().slideUp(0);
        }

        block.toggleClass("opened");

        $(document).off("mouseup");

        $(document).mouseup(function (e) {
          if (!block.is(e.target) && block.has(e.target).length === 0) {
            $(".select-block__list").stop().slideUp(0);
            block.removeClass("opened");
          }
        });
      });
    });
  }
  if ($(".type-products__arrow").length > 0) {
    $(".type-products__arrow .arrow--outside").on("click", function () {
      $(this)
        .toggleClass("opened")
        .siblings(".type-products__sub")
        .slideToggle();
    });

    $(".type-products__arrow .arrow--inside").on("click", function () {
      $(this)
        .toggleClass("opened")
        .siblings(".type-products__sub--inner")
        .slideToggle();
    });

    $(".type-products__sub").map(function () {
      addClassNotArrow($(this));
    });

    $(".type-products__sub--inner").map(function () {
      addClassNotArrow($(this));
    });

    function addClassNotArrow(self) {
      if (self.find("li").length === 0) {
        self.siblings(".arrow").addClass("not-arrow");
      }
    }
  }

  if ($(".menu-pages").length > 0) {
    blockTransfer($(".menu-pages"), $(".catalog__leftSide"), $(".main"), 1200);
  }

  if ($(".subscribe-section__slider").length > 0) {
    const swiper = new Swiper(".subscribe-section__slider", {
      spaceBetween: 30,
      effect: "fade",
      allowTouchMove: false,
      fadeEffect: { crossFade: true },
      speed: 1500,
      autoplay: {
        delay: 30000,
        disableOnInteraction: true,
      },
    });
  }

  // if ($(".selections-links").length > 0) {
  //   $(".selections-links").on("click", function (e) {
  //     console.log("stop");
  //    // e.stopPropagation();
  //   });
  // }

  if ($(".selections-links").length > 0) {
    $(".selections-links").on("click", function (e) {
      //e.stopPropagation();
    });
  }

  if ($(".selection-small__product").length > 0) {
    $(".selection-small__product a").on("click", function (e) {
      // console.log("stop");
      // e.stopPropagation();
    });
  }

  if ($(".about-brand__list").length > 0) {
    let count = $(".about-brand__list").find(".about-brand__item");

    if (count.length === 1) {
      $(".about-brand__list").addClass("about-brand--one");
    }
  }

  if ($(".filter-settings").length > 0) {
    filterTags = $(".filter-settings li");
    tagsInit(filterTags);
  }

  if ($(".about-bs-brand__title").length > 0) {
    moveTitle(".about-bs-brand__title"); // перемещение заголовка в тексте.
  }

  if ($(".about-brand__title").length > 0) {
    moveTitle(".about-brand__title"); // перемещение заголовка в тексте.
  }

  if ($(".text-simple").length > 0) {
    let child = $(".text-simple").find("[style]");
    child.attr("style", "");
  }

  if ($(".category-text__text").length > 0) {
    let child = $(".category-text__text").find("[style]");
    child.attr("style", "");
  }

  if ($(".select-tags").length > 0) {
    $(".select-tags").select2({
      multiple: true,
    });
  }

  if ($(".category-section--video").length > 0) {
    if ($(window).width() < 1023) {
      $(".category-section--video .swiper-slide a").map(function () {
        let mobileHref = $(this).attr("data-mobile-href");

        $(this).attr("href", mobileHref);
      });
    }
  }
});

function moveTitle(name) {
  let title = $(name);

  if (title.parents(".category-text__text")) {
    title.removeClass("name").addClass("caption");
    title.parents(".category-text__line").prepend(title);
  }
}

function fixedMobileHeight() {
  // решение проблемы 100vh на мобиле
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  });
}

fixedMobileHeight();

function tagsInit(list) {
  if ($(window).width() < 1200) {
    let filterSettings = $(".filter-settings");

    if ($(".filter-settings").hasClass("init")) {
      return false;
    }

    let button = `<button class="catalog-collections__more catalog-collections__more--plus">
                  <span class="symbol">+</span>
                </button>`;

    if (list.length > 3) {
      list.remove();

      for (let i = 0; i < 3; i++) {
        $(".filter-settings").append(list[i]);
      }

      $(".filter-settings").addClass("init").addClass("load");
      $(".filter-settings").append(button);

      $(".filter-settings .catalog-collections__more").on("click", function () {
        $(this).remove();
        for (let i = 3; i < list.length; i++) {
          $(".filter-settings").append(list[i]);
        }
      });
    }
  } else {
    $(".filter-settings").addClass("load");

    if ($(".filter-settings").hasClass("init")) {
      $(".filter-settings").removeClass("load").removeClass("init");
      list.remove();
      $(".filter-settings .catalog-collections__more").remove();
      $(".filter-settings").append(list);
      $(".filter-settings").addClass("load");
    }
  }
}

function countblock() {
  if ($(".count-block").length > 0) {
    $(".count-block").map(function () {
      let plus = $(this).find(".count-plus");
      let minus = $(this).find(".count-minus");
      let input = $(this).find(".input-count");
      let count = $(this).find(".input-count").val();

      plus.on("click", function (e) {
        e.preventDefault();
        count++;
        input.val(count);
      });

      minus.on("click", function (e) {
        e.preventDefault();
        count--;

        if (count <= 0) {
          count = 1;
        }

        input.val(count);
      });
    });
  }
}

countblock();

$(document).on("fullscreenchange", function (event) {
  document.fullscreenElement
    ? event.target.setAttribute("controls", true)
    : event.target.removeAttribute("controls");
});

$(window).on("resize", function () {
  if ($(".js-head-open").length > 0) {
    if ($(window).width() >= responsive1199) {
      destroyAccardeon(".footer");
    } else {
      initAccardeon(".footer");
    }
  }

  if ($(".caterogy-title").length > 0) {
    if (
      $(window).width() <= responsive1199 &&
      !$(".caterogy-title").hasClass("wrap-js")
    ) {
      wrapText("mobile");
    } else {
      wrapText("desktop");
    }
  }

  if ($(".mobile-filter").length > 0) {
    if (
      $(window).width() <= responsive1199 &&
      !$(".mobile-filter").hasClass("fixed")
    ) {
      getPositionBtnFilter($(".mobile-filter"));
    }
  }

  if ($(".filter-settings").length > 0) {
    tagsInit(filterTags);
  }
});

$(window).on("load", function () {
  if ($("#map").length > 0) {
    setTimeout(() => ymapsLoad(), 500);
    setTimeout(() => ymaps.ready(init), 1000);
  }

  function ymapsLoad() {
    var script = document.createElement("script");
    script.src =
      "https://api-maps.yandex.ru/2.1/?apikey=0cec76e1-1847-46ed-a96a-c84c0917f2ad&lang=ru_RU";
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  function init() {
    var myMap = new ymaps.Map("map", {
      center: [55.744756354739636, 37.57666889814756],
      zoom: 13,
      controls: [],
    });

    myPlacemarkWithContent = new ymaps.Placemark(
      [55.744756354739636, 37.57666889814756],
      {},
      {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: "default#imageWithContent",
        // // Своё изображение иконки метки.
        iconImageHref: "/img/placeholder.svg",
        // // Размеры метки.
        iconImageSize: [55, 55],
        // // Смещение левого верхнего угла иконки относительно
        // // её "ножки" (точки привязки).
        iconImageOffset: [-22.5, -55],
        // // Смещение слоя с содержимым относительно слоя с картинкой.
        iconContentOffset: [0, 0],
      }
    );
    myMap.geoObjects.add(myPlacemarkWithContent);
    myMap.panes.get("ground").getElement().style.filter = "grayscale(100%)";
    myMap.behaviors.disable("scrollZoom");
  }
});

function initAccardeon(block) {
  if (!$(block).hasClass("accardeon-initialization")) {
    let content = $(block).find(".js-content");
    let links = $(block).find(".js-head-open");

    $(block).addClass("accardeon-initialization");

    if (!content.parents(".product-info__detailsLine")) {
      // если аккардеон в карточке товара то не закрываем
      content.stop().slideUp();
      links.removeClass("open");
    }

    links.on("click", function () {
      if ($(this).hasClass("open")) {
        links.removeClass("open");
        content.stop().slideUp();

        $(this)
          .siblings(".js-content")
          .stop()
          .slideToggle({
            start: function () {
              $(this).css("display", "grid");
            },
          });
      } else {
        links.removeClass("open");
        content.stop().slideUp();

        $(this)
          .addClass("open")
          .siblings(".js-content")
          .stop()
          .slideToggle({
            start: function () {
              $(this).css("display", "grid");
            },
          });
      }
    });

    if ($(".product-info__detailsLine").length > 0) {
      let firstLine = $(".product-info__detailsLine")[0];
      $(firstLine).find(".js-head-open").addClass("open");
      $(firstLine)
        .find(".js-content")
        .slideDown({
          start: function () {
            $(this).css("display", "grid");
          },
        });
    }
  }
}

function destroyAccardeon(block) {
  if ($(block).hasClass("accardeon-initialization")) {
    let content = $(block).find(".js-content");
    let links = $(block).find(".js-head-open");

    links.off("click").removeClass("open");
    content.slideDown();

    $(block).removeClass("accardeon-initialization");
  }
}

function openFullVideo(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function initCollection(block) {
  let minus = block.find(".catalog-collections__more--minus");
  let plus = block.find(".catalog-collections__more--plus");
}

function wrapText(device) {
  let html = $(".caterogy-title").html();
  $(".caterogy-title").remove();

  switch (device) {
    case "mobile":
      $(".caterogy-title").addClass("wrap-js");
      $(".catalog__rightSide").prepend(
        `<div class='caterogy-title'>${html}</div>`
      );
      break;

    case "desktop":
      $(".caterogy-title").removeClass("wrap-js");
      $(".caterory-info").prepend(`<div class='caterogy-title'>${html}</div>`);
      $(".catalog__leftSide").attr(
        "style",
        `margin-top:${$(".caterory-info").height()}px`
      );

      break;

    default:
      break;
  }
}

function getPositionBtnFilter(btn) {
  let positionBlock = btn.offset().top + btn.outerHeight();

  return positionBlock;
}

function fixedMobileBtnFilter() {
  let btnMobileFilter = $(".mobile-filter");
  let parents = btnMobileFilter.parents(".catalog__controls");

  if (currentScroll > positionMobileBtnFilter) {
    parents.css("padding-bottom", `${btnMobileFilter.outerHeight() + 12}px`);
    btnMobileFilter.addClass("fixed");
  } else {
    parents.css("padding-bottom", "0");
    btnMobileFilter.removeClass("fixed");
  }
}

function fixedAnchor() {
  let fixBlock = $(".article-anchor");

  if (currentScroll > positionAnchorFixed) {
    // parents.css("padding", `${fixBlock.outerHeight() + 48}px`);
    fixBlock.addClass("fixed");
  } else {
    // parents.css("padding-bottom", "0");
    fixBlock.removeClass("fixed");
  }
}

function initFilterSort() {
  $(".list-letters li").on("click", function (e) {
    e.preventDefault();

    if ($(this).find(".letter").hasClass("disabled")) {
      return;
    }

    $(".input-brand-filter").val("");
    $(".list-letters li").removeClass("active");
    $(this).addClass("active");

    let sortValue = $(this).find("a").text().toLowerCase();
    let brandsItems = $(".filter-brand .check-block");

    $(".check-list .letter").show();

    brandsItems.each(function () {
      let curreElem = $(this).find("label").text();
      let currArr = curreElem.toLowerCase().replace(/ /g, "").split("");
      let self = $(this);

      switch (sortValue) {
        case "a–z":
          self.show();
          break;

        case "#":
          $(".check-list .letter").hide();

          let str = Number(currArr[0]);
          str ? self.show() : self.hide();

          break;

        default:
          currArr[0] == sortValue ? self.show() : self.hide();

          $(".check-list .letter").each(function () {
            if ($(this).text().toLowerCase() !== sortValue) {
              $(this).hide();
            }
          });
      }
    });
  });

  $(".input-brand-filter").on("keyup", function () {
    let inputVal = $(this).val().toLowerCase(); //значение инпута

    $(".check-list .letter").hide();
    $(".list-letters li").removeClass("active");
    $(".list-letters li:first-child").addClass("active");

    setTimeout(function () {
      $(".filter-brand .check-block").each(function () {
        let chbVal = $(this).find("label").text().toLowerCase();
        chbVal.indexOf(inputVal) + 1 ? $(this).show() : $(this).hide();
      });
    }, 500);
  });
}

function openPopupAuth(modal) {
  setTimeout(function () {
    let modalCurrent = $("#" + modal);
    let modal_close = modalCurrent.find(".modal__close");
    let modal_overlay = modalCurrent.find(".modal__overlay");
    console.log(modalCurrent);
    MicroModal.show(modal);

    modalCurrent.addClass("is-init");
    $("body").addClass("modal-open");

    modal_overlay.on("click", function (event) {
      if (modal_overlay.has(event.target).length === 0) {
        deletePopupAuth(modalCurrent);
      }
    });
    modal_close.on("click", function (event) {
      if (modal_close.has(event.target).length === 0) {
        deletePopupAuth(modalCurrent);
      }
    });
  }, 100);
}

function deletePopupAuth(modalCurrent) {
  modalCurrent.remove();
  $("body").removeClass("modal-open");
}

function blockTransfer(block, from, here, responsive) {
  if ($(window).width() < responsive) {
    addBlock();
  } else {
    deleteBlock();
  }

  $(window).on("resize", function () {
    if ($(window).width() < responsive) {
      !block.hasClass("init-clone") && addBlock();
    } else {
      block.hasClass("init-clone") && deleteBlock();
    }
  });

  function addBlock() {
    block.addClass("init-clone");
    here.append($(".menu-pages"));
  }

  function deleteBlock() {
    block.removeClass("init-clone");
    from.append($(".menu-pages"));
  }
}

//Инициализация плеера для видео с ютуба
var player;
function onYouTubeIframeAPIReady() {
  if (VIDEO_ID) {
    player = new YT.Player("player", {
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 0,
        controls: 0,
        showinfo: 0,
        rel: 0,
        mute:
          $(".product-info").length > 0 && $(".video-section").length > 0
            ? 1
            : 0,
      },
      videoId: VIDEO_ID,
      events: {
        onReady: onPlayerReady,
      },
    });
  }
}

function onPlayerReady(event) {
  observerPlayVideo = () => {
    event.target.playVideo();
    let iframe = $("#player");
    setupListener(event);
    $(".video__btn--volume").addClass("mute");
    $(".video__btn--play").addClass("paused");
  };

  observerPausedVideo = () => {
    event.target.pauseVideo();
    let iframe = $("#player");
    setupListener(event);
    $(".video__btn--volume").removeClass("mute");
    $(".video__btn--play").removeClass("paused");
  };

  $(".video__btn--play").on("click", function () {
    !$(this).parents(".video").hasClass("clearPoster") &&
      closeVideoPoster($(this).parents(".video"));

    $(this).toggleClass("paused");
    $(this).hasClass("paused")
      ? event.target.playVideo()
      : event.target.pauseVideo();
  });

  $(".video__btn--volume").on("click", function () {
    let seft = $(this);

    if ($(".video__btn--volume").hasClass("mute")) {
      player.unMute();
      player.setVolume("100");
      seft.removeClass("mute");
    } else {
      player.setVolume("0");
      seft.addClass("mute");
    }
  });

  iframe = $("#player");
  setupListener(event);
}

function setupListener(event) {
  $(".video__btn--full").on("click", () => playFullscreen(event));
}

function playFullscreen(event) {
  // event.target.playVideo();
  // $(".video__btn--play").toggleClass("paused");
  if (iframe[0].requestFullscreen) {
    iframe[0].requestFullscreen();
  } else if (iframe[0].mozRequestFullScreen) {
    iframe[0].mozRequestFullScreen();
  } else if (iframe[0].webkitRequestFullscreen) {
    iframe[0].webkitRequestFullscreen();
  } else if (iframe[0].msRequestFullscreen) {
    iframe[0].msRequestFullscreen();
  }
}

function closeVideoPoster(parents) {
  parents.addClass("clearPoster");
  $(".video-poster").hide();
}
// /Инициализация плеера для видео с ютуба

$(document).on("click", ".cart-item-js", function (event) {
  var $self = $(this);

  var productId = $self.data("id");
  var productId2 = $self.data("prod-id");
  var action = $self.data("action");

  if (action == "UpdateBasketItem") {
    var quantity = $(
      '.basket-form .input-count[data-id="' + productId + '"]'
    ).val();
  } else if (action == "UpdateBasketMiniItem") {
    var quantity = $(
      '.basket-invis .input-count[data-id="' + productId + '"]'
    ).val();
  }
  var data = {
    id: productId,
    action: action,
    quantity: quantity,
    product_id: productId2,
  };

  if (!action) {
    data = {
      action: "clearBasketFull",
    };
  }
  BX.showWait();
  $.ajax({
    url: "/local/ajax/cart.php",
    method: "post",
    dataType: "html",
    data: data,
    success: function (response) {
      BX.closeWait();
      if (action == "ClearBasketItem") {
        $('.basket-item[data-id="' + productId + '"]').remove();
        if ($(".basket-form .basket-item").length <= 0) {
          location.reload();
        }

        $(".count-basket").html(response);
        var numberPattern = /\d+/g;
        var count = response.match(numberPattern);
        $(".btn-basket__count").text(count[0]);
      } else if (action == "UpdateBasketItem") {
        bMiniUpdate();
      } else if (action == "UpdateBasketMiniItem") {
        bMiniUpdate();
      } else {
        if (action) {
          location.reload();
        } else {
          location.href = "/cart/success/";
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
});

$(document).on("submit", "#cartCheckout", function (e) {
  e.preventDefault();
  var form = $(this);
  var order = true;
  form.find('input[name="sp"]').val("nospam");
  var actionUrl = form.attr("action");
  BX.showWait();
  $.ajax({
    type: "post",
    url: actionUrl,
    dataType: "html",
    data: form.serialize(),
    success: function (response) {
      BX.closeWait();
      form[0].reset();
      $(".clear-basket-success.cart-item-js").click();
    },
  });
});

$(document).on("click", ".catalog-collections__more--plus", function (event) {
  event.preventDefault();
  $(".collections-list li").show();
  $(this).hide();
});

var timerUpdate = false;
function bMiniUpdate(showMiniBasket) {
  if (timerUpdate) {
    clearTimeout(timerUpdate);
  }

  var showMiniBasket =
    typeof showMiniBasket != "undefined" ? showMiniBasket : false;
  timerUpdate = setTimeout(function () {
    BX.showWait();
    $.ajax({
      url: BX.message("SITE_DIR") + "cart/",
      data: "AJAX=Y",
      success: function (data) {
        BX.closeWait();
        if ($("div#full_cart").length == 0) {
          $(".basket-invis__not").remove();
        } else {
          $("section#full_cart").html(
            $(data).find("section#full_cart").first().html()
          );
          $("div#full_cart").html($(data).find("div#full_cart").first().html());
          countblock();
        }
      },
      dataType: "html",
      type: "POST",
    });
  }, 200);
}

$(document).on("click", ".basket-detele", function (event) {
  event.preventDefault();
  if ($(".btn-basket__count").length > 0) {
    var count_old = parseInt(
      $(".header-controls .btn-basket .btn-basket__count").text()
    );
    count_old = parseInt(count_old) - 1;
    $(".btn-basket__count").text(count_old);

    if (count_old == 0) {
      $(".btn-basket__count").remove();
    }
  }
});

$(document).on("click", ".cabinet-js", function (e) {
  e.preventDefault();

  let self = $(this);
  let type = self.attr("data-type");
  let action = self.attr("data-action");
  let modalID = self.attr("data-set-modal");
  let productID = self.attr("data-product-id");
  let userID = self.attr("data-user");
  let price = self.attr("data-price");
  let sale = self.attr("data-sale");

  let sendData = {
    FORM_TYPE: type,
    user_id: userID,
    product_id: productID,
    price: price,
    sale: sale,
  };

  $.ajax({
    type: "post",
    url: action,
    dataType: "html",
    data: sendData,
    success: function (responsive) {
      if ($(".modal--auth").hasClass("is-init")) {
        $(".modal--auth").remove();
      }

      $("body").append(responsive);

      openPopupAuth(modalID);
    },
  });
});

// preloader
let initLoader = function () {
  if (document.querySelector(".c-js-loader.wrapper") === null) {
    let loader = document.createElement("div");
    let ovderlay = document.createElement("div");
    ovderlay.setAttribute("class", "preloader-overlay");
    loader.setAttribute("class", "c-js-loader wrapper");
    loader.setAttribute("role", "loader");
    loader.style.cssText = "min-height: 1px; min-width: 1px;";
    let btnCloseLoader = document.createElement("button");
    btnCloseLoader.setAttribute("class", "c-js-loader btn-close");
    btnCloseLoader.setAttribute("type", "button");
    btnCloseLoader.setAttribute("title", "Закрыть Loader");
    btnCloseLoader.setAttribute("role", "loader-close");
    btnCloseLoader.innerHTML = '<span class="text">Закрыть</span>';
    btnCloseLoader.addEventListener("mousedown", function (event) {
      document.querySelector("body").classList.remove("--js-loader-show");
    });
    loader.prepend(btnCloseLoader);
    document.querySelector("body").prepend(loader);
    document.querySelector("body").prepend(ovderlay);
  }
};

initLoader();

let windowLoader = function (
  mode = "",
  position = "center",
  showClose = false,
  duration = 0
) {
  if (mode === "") {
    return false;
  }
  let loaderDOM = document.querySelector(".c-js-loader.wrapper");
  let bodyDOM = document.querySelector("body");
  let loaderClose = loaderDOM.querySelector(".c-js-loader.btn-close");
  if (showClose) {
    loaderClose.classList.add("--show-btn");
  } else {
    loaderClose.classList.remove("--show-btn");
  }
  loaderDOM.setAttribute("data-position", position);

  let bodyClass = "--js-loader-show";
  if (mode === "show") {
    bodyDOM.classList.add(bodyClass);
    if (duration > 0) {
      setTimeout(function () {
        bodyDOM.classList.remove(bodyClass);
      }, duration * 1000);
    }
  }
  if (mode === "close") {
    bodyDOM.classList.remove(bodyClass);
    if (duration > 0) {
      setTimeout(function () {
        bodyDOM.classList.remove(bodyClass);
      }, duration * 1000);
    }
  }
  if (mode === "error") {
    if (loaderDOM === null) {
      initLoader();
      loaderDOM = document.querySelector(".c-js-loader.wrapper");
    }
    bodyDOM.classList.add(bodyClass);
    if (loaderDOM !== null) {
      loaderDOM.classList.add("--error");
    }
    if (duration == 0) {
      duration = 3;
    }
    if (duration >= 0) {
      setTimeout(function () {
        loaderDOM.classList.remove("--error");
        bodyDOM.classList.remove(bodyClass);
      }, duration * 1000);
    }
  }
};

BX.showWait = function () {
  windowLoader("show");
};

BX.closeWait = function () {
  windowLoader("close");
};

// /preloader

function closeModal(modal) {
  MicroModal.close(modal);
}
