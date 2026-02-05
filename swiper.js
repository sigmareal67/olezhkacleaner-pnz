/* swiper.js - Локальная версия Swiper JS 11.0.5 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
})(this, (function () { 'use strict';

    // Базовая функциональность Swiper
    var Swiper = function Swiper(container, params) {
        var self = this;
        
        // Параметры по умолчанию
        var defaults = {
            direction: 'horizontal',
            speed: 300,
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            autoplay: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            on: {}
        };
        
        // Объединение параметров
        self.params = Object.assign({}, defaults, params);
        
        // Получение элементов
        self.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!self.container) {
            console.error('Swiper container not found');
            return;
        }
        
        self.wrapper = self.container.querySelector('.swiper-wrapper');
        self.slides = Array.from(self.wrapper.children);
        
        // Инициализация свойств
        self.activeIndex = 0;
        self.isAnimating = false;
        self.translate = 0;
        self.autoplayTimeout = null;
        self.initialized = false;
        
        // Инициализация
        self._init();
    };

    Swiper.prototype = {
        _init: function() {
            var self = this;
            
            // Установка размеров
            self.updateSize();
            
            // Настройка wrapper
            self.wrapper.style.display = 'flex';
            self.wrapper.style.transition = 'transform ' + self.params.speed + 'ms ease';
            
            // Навигация
            if (self.params.navigation) {
                self._initNavigation();
            }
            
            // Автопрокрутка
            if (self.params.autoplay) {
                self._initAutoplay();
            }
            
            // События
            self._initEvents();
            
            // Обновление
            self.updateSlides();
            self.updateClasses();
            
            self.initialized = true;
            self.container.classList.add('swiper-initialized');
        },
        
        _initNavigation: function() {
            var self = this;
            var nextBtn = self.container.querySelector(self.params.navigation.nextEl);
            var prevBtn = self.container.querySelector(self.params.navigation.prevEl);
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.slideNext();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.slidePrev();
                });
            }
        },
        
        _initAutoplay: function() {
            var self = this;
            var autoplayParams = typeof self.params.autoplay === 'object' 
                ? self.params.autoplay 
                : { delay: 3000 };
            
            self._startAutoplay(autoplayParams.delay);
        },
        
        _startAutoplay: function(delay) {
            var self = this;
            
            if (self.autoplayTimeout) {
                clearTimeout(self.autoplayTimeout);
            }
            
            self.autoplayTimeout = setTimeout(function() {
                if (!self.isAnimating) {
                    self.slideNext();
                }
                self._startAutoplay(delay);
            }, delay);
        },
        
        _initEvents: function() {
            var self = this;
            var resizeHandler = function() {
                self.updateSize();
                self.updateSlides();
            };
            
            window.addEventListener('resize', resizeHandler);
        },
        
        updateSize: function() {
            var self = this;
            self.width = self.container.clientWidth;
            self.height = self.container.clientHeight;
        },
        
        updateSlides: function() {
            var self = this;
            var slideWidth = self.width / self.params.slidesPerView;
            
            self.slides.forEach(function(slide) {
                slide.style.width = slideWidth + 'px';
                slide.style.flexShrink = '0';
            });
            
            // Обновление позиции
            self._setTranslate();
        },
        
        updateClasses: function() {
            var self = this;
            
            // Удаляем все активные классы
            self.slides.forEach(function(slide) {
                slide.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev');
            });
            
            // Добавляем активный класс
            if (self.slides[self.activeIndex]) {
                self.slides[self.activeIndex].classList.add('swiper-slide-active');
            }
            
            // Следующий слайд
            var nextIndex = (self.activeIndex + 1) % self.slides.length;
            if (self.slides[nextIndex]) {
                self.slides[nextIndex].classList.add('swiper-slide-next');
            }
            
            // Предыдущий слайд
            var prevIndex = (self.activeIndex - 1 + self.slides.length) % self.slides.length;
            if (self.slides[prevIndex]) {
                self.slides[prevIndex].classList.add('swiper-slide-prev');
            }
        },
        
        slideTo: function(index, speed) {
            var self = this;
            
            if (self.isAnimating || index < 0 || index >= self.slides.length) {
                return;
            }
            
            self.isAnimating = true;
            self.activeIndex = index;
            
            var transitionSpeed = speed || self.params.speed;
            self.wrapper.style.transition = 'transform ' + transitionSpeed + 'ms ease';
            self._setTranslate();
            
            setTimeout(function() {
                self.isAnimating = false;
                self.updateClasses();
            }, transitionSpeed);
        },
        
        slideNext: function(speed) {
            var self = this;
            var nextIndex = self.activeIndex + 1;
            
            if (self.params.loop && nextIndex >= self.slides.length) {
                nextIndex = 0;
            } else if (nextIndex >= self.slides.length) {
                nextIndex = self.slides.length - 1;
            }
            
            self.slideTo(nextIndex, speed);
        },
        
        slidePrev: function(speed) {
            var self = this;
            var prevIndex = self.activeIndex - 1;
            
            if (self.params.loop && prevIndex < 0) {
                prevIndex = self.slides.length - 1;
            } else if (prevIndex < 0) {
                prevIndex = 0;
            }
            
            self.slideTo(prevIndex, speed);
        },
        
        _setTranslate: function() {
            var self = this;
            var slideWidth = self.width / self.params.slidesPerView;
            self.translate = -self.activeIndex * slideWidth;
            self.wrapper.style.transform = 'translate3d(' + self.translate + 'px, 0, 0)';
        },
        
        destroy: function() {
            var self = this;
            
            if (self.autoplayTimeout) {
                clearTimeout(self.autoplayTimeout);
            }
            
            // Удаляем стили
            self.slides.forEach(function(slide) {
                slide.style.width = '';
                slide.style.flexShrink = '';
            });
            
            self.wrapper.style.cssText = '';
            self.container.classList.remove('swiper-initialized');
            
            self.initialized = false;
        }
    };

    return Swiper;
}));