import { Component, ViewChild, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit {
  submitted = false
  errorStatus: any = null
  errorMessage: any = null

  hasAPIError = false
  hasResponseError = false
  apiRoot: string = 'https://homework.fdp.workers.dev/'

  headers = new HttpHeaders({
    "x-api-key": "swb-222222",
    });

  loanData: any = null
  loanAmount : any = null;
  interestRate : any = null;
  errorFields : any = null;

  @ViewChild('f', { static: false }) loanFrm: NgForm | undefined

  constructor(private http: HttpClient) {}

  calculateLoan(data: any) {
    this.http.post(this.apiRoot, data, {'headers': this.headers}).subscribe({
      next: (responseData) => {
        this.loanData =  responseData;        
        this.hasAPIError = false;
        this.hasResponseError = false;
        this.errorStatus = null;
        this.errorMessage = null;
        this.errorFields = null;
        this.loanAmount = this.currencyFormat(this.loanData.loanAmount);
        this.interestRate = this.currencyFormat(this.loanData.interestRate);
      },
      error: (e) => {
        if(e.status == 0){          
          this.hasAPIError = true
          this.errorStatus = e.statusText
          this.errorMessage = e.message
        }
        else{
          this.hasResponseError = true;
          this.errorFields = e.error.fields;
        }                
      },
      complete: () => console.info('complete'),
    })
  }

  submitForm(loanData: any) {
    if (this.loanFrm && this.loanFrm.valid) {
      this.submitted = true
      this.calculateLoan(loanData)
    }
  }

  currencyFormat(value: number) {
    return value && Number(value).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
    })
  }

  ngOnInit(): void {}
}
