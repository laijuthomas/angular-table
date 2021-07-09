import { Component, HostBinding } from '@angular/core';
@Component({
  selector: 'app-spinner',
  template: `
    <span class="spin-circle"></span>
  `,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {

  @HostBinding('class.medium-spinner')
  get medium() {
    return 'medium';
  }

  @HostBinding('class.active-spinner')
  get active() {
    return 'active';
  }
}
