import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]'
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Add initial hidden class
    this.el.nativeElement.classList.add('scroll-animate-hidden');

    // Create intersection observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Trigger when 15% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class when element enters viewport
          entry.target.classList.add('scroll-animate-visible');
          entry.target.classList.remove('scroll-animate-hidden');
          
          // Optionally unobserve after animation
          // this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Start observing
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}