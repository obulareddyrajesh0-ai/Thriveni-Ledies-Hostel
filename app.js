/**
 * Thriveni Ladies Hostel - Interactive Application Logic
 * Pure ES6 Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Header Scroll State
  // --------------------------------------------------------------------------
  const header = document.querySelector('.main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------------
  // Mobile Drawer Navigation
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobileMenuToggle');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer?.classList.add('active');
    drawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('active');
    drawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggleBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // --------------------------------------------------------------------------
  // FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items for single-open experience
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Interactive Visit & Enquiry Modal
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('visitModal');
  const openModalBtns = document.querySelectorAll('.js-open-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const enquiryForm = document.getElementById('enquiryForm');
  const roomSelect = document.getElementById('enquiryRoom');

  const openModal = (preferredRoom = null) => {
    if (preferredRoom && roomSelect) {
      // Find matching option or set value
      for (let i = 0; i < roomSelect.options.length; i++) {
        if (roomSelect.options[i].value.toLowerCase().includes(preferredRoom.toLowerCase()) || 
            preferredRoom.toLowerCase().includes(roomSelect.options[i].value.toLowerCase())) {
          roomSelect.selectedIndex = i;
          break;
        }
      }
    }
    modalBackdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preferredRoom = btn.getAttribute('data-room');
      openModal(preferredRoom);
    });
  });

  closeModalBtn?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission handler -> Formats WhatsApp enquiry message
  enquiryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('enquiryName');
    const phoneInput = document.getElementById('enquiryPhone');
    const roomInput = document.getElementById('enquiryRoom');
    const typeInput = document.getElementById('enquiryType');
    const messageInput = document.getElementById('enquiryMessage');

    const name = nameInput?.value.trim() || 'Visitor';
    const phone = phoneInput?.value.trim() || 'Not specified';
    const roomType = roomInput?.value || '2 / 5 / 6 / 6+ Sharing';
    const residentType = typeInput?.value || 'Prospective Resident';
    const notes = messageInput?.value.trim() || 'Please share room availability and details.';

    const waText = encodeURIComponent(
      `Hello Thriveni Ladies Hostel,\n\n` +
      `I am interested in hostel accommodation in Tirupati.\n` +
      `• Name: ${name}\n` +
      `• Contact: ${phone}\n` +
      `• Preferred Room: ${roomType}\n` +
      `• Resident Type: ${residentType}\n` +
      `• Query / Preferred Date: ${notes}\n\n` +
      `Looking forward to your response!`
    );

    const waUrl = `https://wa.me/918978951299?text=${waText}`;
    
    // Close modal and redirect to WhatsApp
    closeModal();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  // --------------------------------------------------------------------------
  // Room Photo Carousel Logic
  // --------------------------------------------------------------------------
  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const dots = document.querySelectorAll('.carousel-dot');
  const carousel = document.getElementById('roomCarousel');

  if (track && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;

    const updateCarousel = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
        dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
      });
    };

    const nextSlide = () => updateCarousel(currentSlide + 1);
    const prevSlide = () => updateCarousel(currentSlide - 1);

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateCarousel(index);
        resetAutoplay();
      });
    });

    // Auto-play timer
    const startAutoplay = () => {
      stopAutoplay();
      autoPlayTimer = setInterval(nextSlide, 4500);
    };

    const stopAutoplay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    carousel?.addEventListener('mouseenter', stopAutoplay);
    carousel?.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carousel?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    carousel?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        nextSlide();
      } else if (touchEndX - touchStartX > 45) {
        prevSlide();
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  }

  // --------------------------------------------------------------------------
  // Smooth scroll with header offset
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
