// Slider Object to encapsulate slider functionality
const Slider = {
  // Initialize variables to keep track of the current slide and total number of slides
  currentSlide: 0,
  totalSlides: document.querySelectorAll(".slide").length,

  // Select the slider and slider container elements
  slider: document.querySelector(".slider"),
  sliderContainer: document.querySelector(".slider-container"),

  // Set an interval for automatic sliding, adjust the interval duration as needed (e.g., 5000ms for 5 seconds)
  slideInterval: null,

  init: function () {
    // Initialize mouse listeners
    this.setupEventListeners();
    this.startSlideInterval();
  },

  showSlide: function (index) {
    // Calculate the translation value for the slide based on its index
    const translateValue = -index * 100 + "%";
    // Apply a smooth transition effect to the slider element
    this.slider.style.transition = "transform 0.5s ease-in-out";
    // Move the slider to the specified slide using the transform property
    this.slider.style.transform = "translateX(" + translateValue + ")";
  },

  nextSlide: function () {
    // Update the current slide index, ensuring it wraps around to the first slide if necessary
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.showSlide(this.currentSlide);
  },

  prevSlide: function () {
    // Update the current slide index, ensuring it wraps around to the last slide if necessary
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.currentSlide);
  },

  resetTransition: function () {
  // Reset the transition property after each slide transition to prevent unintended acceleration
    this.slider.style.transition = "none";
  },

  startSlideInterval: function () {
    this.slideInterval = setInterval(this.nextSlide.bind(this), 5000);
  },

  pauseSlideInterval: function () {
    clearInterval(this.slideInterval);
  },

  setupEventListeners: function () {
    document.querySelector(".prev").addEventListener("click", this.prevSlide.bind(this));
    document.querySelector(".next").addEventListener("click", this.nextSlide.bind(this));

    this.slider.addEventListener("transitionend", () => {
      this.resetTransition();
    });

    // Optional: Pause automatic sliding when the mouse enters the slider container
    this.sliderContainer.addEventListener("mouseenter", () => {
      this.pauseSlideInterval();
    });
    // Optional: Resume automatic sliding when the mouse leaves the slider container
    this.sliderContainer.addEventListener("mouseleave", () => {
      this.startSlideInterval();
    });
  },
};

// Initialize the Slider object
Slider.init();

