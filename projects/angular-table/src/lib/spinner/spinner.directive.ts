
import {
  ComponentFactoryResolver,
  ComponentFactory,
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef, HostBinding,
} from '@angular/core';

import { SpinnerComponent } from './spinner.component';

@Directive({ selector: '[appSpinner]' })
export class SpinnerDirective implements OnInit {

  spinner: ComponentRef<SpinnerComponent>;
  componentFactory: ComponentFactory<SpinnerComponent>;

  @HostBinding('class.spinner-container') isSpinnerExist = false;

  /**
   * Directive value - show or hide spinner
   */
  @Input('appSpinner')
  set appSpinner(val: boolean) {
    if (this.componentFactory) {
      if (val) {
        this.show();
      } else {
        this.hide();
      }
    } else {
      this.shouldShow = val;
    }
  }

  private shouldShow = false;

  constructor(private directiveView: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private directiveElement: ElementRef) {
  }

  ngOnInit() {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
    if (this.shouldShow) {
      this.show();
    }
  }

  hide() {
    if (this.isSpinnerExist) {
      this.directiveView.remove();
      this.isSpinnerExist = false;
    }
  }

  show() {
    if (!this.isSpinnerExist) {
      this.spinner = this.directiveView.createComponent<SpinnerComponent>(this.componentFactory);
      this.spinner.changeDetectorRef.detectChanges();
      this.renderer.appendChild(this.directiveElement.nativeElement, this.spinner.location.nativeElement);
      this.isSpinnerExist = true;
    }
  }
}
