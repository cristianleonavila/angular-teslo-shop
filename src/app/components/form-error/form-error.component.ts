import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.component.html',
  styles: ``
})
export class FormErrorComponent {

  control = input.required<AbstractControl>();

  get errorMessage () {
    const errors: ValidationErrors = this.getErrors();
    return this.control().touched && Object.keys(errors).length > 0
    ? FormUtils.getTextError(errors)
    : null;
  }

  /**
   *
   * @returns ValidationErrors | {}
   */
  private getErrors() {
    return this.control().errors || {};
  }
}
