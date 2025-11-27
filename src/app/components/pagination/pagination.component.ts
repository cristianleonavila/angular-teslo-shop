import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  numPages = input<number>(0);

  currentPage = input<number>(1);

  activePage = linkedSignal(this.currentPage);

  pagesList = computed(() => {
    return Array.from({length: this.numPages()}, (_, i) => i + 1);
  });
}
