import { FormControl, ValidationErrors } from "@angular/forms";

export class FormValidators {

    // whitespace validations
    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        // check if string only contains whitespace
        if((control.value != null) && (control.value.trim().length === 0)) {

            // return error object
            // 'notOnlyWhitespace' -> validation error key
            // html will check for this error key
            return { 'notOnlyWhitespace': true };
        }
        else {
            return null;
        }
    }
}
