// frontend/src/app/shared/rating.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({ selector: 'app-rating', templateUrl: './rating.component.html', styleUrls: ['./rating.component.scss'] })
export class RatingComponent {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  stars = Array(5).fill(0);
  set(n: number){ this.value = n; this.valueChange.emit(n); }
}
