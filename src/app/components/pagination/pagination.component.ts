import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationService } from './pagination.service';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink, CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  numPages = input<number>(0);

  rowsPerPageOpt = [10, 20, 50, 100];

  currentPage = input<number>(1);

  showRowsPerPage = input<boolean>(true);

  activePage = linkedSignal(this.currentPage);

  pagesList = computed(() => {
    return Array.from({length: this.numPages()}, (_, i) => i + 1);
  });

  setRowsPerPage(value:number) {
    PaginationService.rowsPerPage.set(value);
  }
}
