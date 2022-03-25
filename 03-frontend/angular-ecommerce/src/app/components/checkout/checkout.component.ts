import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormServiceService } from 'src/app/services/shop-form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // create group of forms for checkout using FormGroup class
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  
  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  // inject FormBuilder
  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormServiceService) { }

  ngOnInit(): void {

    // build the group form
    this.checkoutFormGroup = this.formBuilder.group({
      
      // build customer form
      customer: this.formBuilder.group({

        // add validators
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
                              [Validators.required,
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      // build shipping address form
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),

      // build billing address form
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
       }),
      
       // build credit card form
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months
    
    const startMonth: number = new Date().getMonth() + 1;
    console.log("start Month: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieve credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieve list of countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  // getter methods for validation checkout
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  copyShippingToBillingAddress(event: Event){
 
    const ischecked = (<HTMLInputElement>event.target).checked;

    if(ischecked){
      this.checkoutFormGroup.controls['billingAddress']
          .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // assign shipping address to billing address to auto populate fields
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // clear billing address fields
      this.billingAddressStates = [];
    }
  }

  onSubmit(){
    console.log("Handling the submit button");

    // check for form validation
    if (this.checkoutFormGroup.invalid){

      // touching all fields triggers the display of the error messages
      this.checkoutFormGroup.markAllAsTouched(); 
    }


    console.log(this.checkoutFormGroup.get('customer')!.value);

    console.log("Shipping Address is: " + this.checkoutFormGroup.get('shippingAddress')!.value);
    console.log("Billing Address is: " + this.checkoutFormGroup.get('billingAddress')!.value);
  }
  
  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    
    // get selected year from the form
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;
    
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieve credit card months:' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

  }

  getStates(formGroupName: string){

    // retrieve data from checkOut form group
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name; // optional

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }
}
