import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

declare let $: any;
declare let formData: any

@Component({
  selector: 'app-webssh',
  templateUrl: './webssh.component.html',
  styleUrls: ['./webssh.component.scss']
})
export class WebsshComponent implements OnInit {
  // form: FormGroup;
  constructor(public router: Router, public formbuilder: FormBuilder) {
    // this.form = this.formbuilder.group({
    //   hostname: [''],
    //   port: [22],
    //   username: [''],
    //   password: [''],
    //   privatekey: [''],
    //   privatekeyfile: [''],
    //   passphrase: [''],
    //   totp: [''],
    //   // _xsrf: ['2|59f66287|7d32261eb35b7c6177212656bf829afd|1674163066']
    // });
  }

  ngOnInit(): void {
  }

  callFormData() {
    formData();
  }

  backToDashboard() {
    this.router.navigate(['dashboard']);
  }



  // Send the POST request
  // async postData() {
  //   if (this.form.invalid) return;
  //   let formData: any = this.form.value;
  //   // console.log(this.form);
  //   // let form_id = '#connect'
  //   // let formId = document.querySelector(form_id)
  //   // let _xsrf = formId?.querySelector('input[name="_xsrf"]')
  //   // this.form._xsrf = _xsrf.value;

  //   let headers: any = {
  //     'Content-Type': 'multipart/form-data',
  //     'Access-Control-Request-Headers': '*',
  //     'Access-Control-Request-Method': '*',
  //     'Cookie': 'JSESSIONID.a863b2a8=node0f5b4nvyx2g6l1c4po4i60zntd6.node0; JSESSIONID.aaa52401=node026x4ukf16jp2pib6cycqv6lx0.node0; lang=en; access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzcGF0ZWwiLCJzY29wZSI6WyJjdXN0b21lcmZyb250ZW5kIiwid2ViY2xpZW50Il0sImV4cCI6MTY5MjcyMjkxNSwiYXV0aG9yaXRpZXMiOlsiQ1VTVE9NRVIiXSwianRpIjoiYWRiYTM5YTYtOWZjNS00YTBhLWFjYjYtYWFmNjQ5NjU3ZjNlIiwiY2xpZW50X2lkIjoiand0Y2xpZW50IiwiVXNlclRva2VuIjp7ImlkIjo5MzIyLCJ1c2VybmFtZSI6InNwYXRlbCIsInBhc3N3b3JkIjoiNzhlNDFhODQ3NmM1NDIyNmZhMGE0MjJjNTBjN2RjNTlhZWQ1MzJhOGNiYWJlMDQ4MTgyYzI1OTVmMGRhMmMyNiIsImZpcnN0bmFtZSI6IlNhbmtldCIsImxhc3RuYW1lIjoiUGF0ZWwiLCJtZXJjaGFudCI6eyJpZCI6MSwicGhvbmUiOm51bGwsImVtYWlsIjpudWxsLCJzdG9yZU5hbWUiOm51bGwsInN0b3JlQ29kZSI6bnVsbH0sImNvdW50cnlOYW1lIjoiVW5pdGVkIFN0YXRlcyIsInVzZXJDcmVhdGVkRGF0ZSI6MTY1MjkwMzI5NzAwMCwicHJvZmlsZUltZ1VybCI6Imh0dHBzOi8vc2Z0cC5ieW5mb3IuY29tL2J5bmZvci9hdXRoL3VzZXJfcHJvZmlsZXMvMjgwMDg4X29yaWdpbmFsX0J5bmZvci5wbmciLCJyYXRpbmdzIjowLjAsImppZCI6InNwYXRlbEB4YW1wcC5ieW5mb3IuY29tIiwib3BlbmZpcmVQYXNzd29yZCI6IlpOSjA0SDgifX0.t3YofJZnbau2bI53_g7XlFQj9ptmUlMgzoZuLALRGkY; refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzcGF0ZWwiLCJzY29wZSI6WyJjdXN0b21lcmZyb250ZW5kIiwid2ViY2xpZW50Il0sImF0aSI6ImFkYmEzOWE2LTlmYzUtNGEwYS1hY2I2LWFhZjY0OTY1N2YzZSIsImV4cCI6MTY2Mzc3ODkxNSwiYXV0aG9yaXRpZXMiOlsiQ1VTVE9NRVIiXSwianRpIjoiZGRlMzYyNzgtMTBiNS00YzVmLWJhOWUtODhlZGYwMTM5NzQ1IiwiY2xpZW50X2lkIjoiand0Y2xpZW50IiwiVXNlclRva2VuIjp7ImlkIjo5MzIyLCJ1c2VybmFtZSI6InNwYXRlbCIsInBhc3N3b3JkIjoiNzhlNDFhODQ3NmM1NDIyNmZhMGE0MjJjNTBjN2RjNTlhZWQ1MzJhOGNiYWJlMDQ4MTgyYzI1OTVmMGRhMmMyNiIsImZpcnN0bmFtZSI6IlNhbmtldCIsImxhc3RuYW1lIjoiUGF0ZWwiLCJtZXJjaGFudCI6eyJpZCI6MSwicGhvbmUiOm51bGwsImVtYWlsIjpudWxsLCJzdG9yZU5hbWUiOm51bGwsInN0b3JlQ29kZSI6bnVsbH0sImNvdW50cnlOYW1lIjoiVW5pdGVkIFN0YXRlcyIsInVzZXJDcmVhdGVkRGF0ZSI6MTY1MjkwMzI5NzAwMCwicHJvZmlsZUltZ1VybCI6Imh0dHBzOi8vc2Z0cC5ieW5mb3IuY29tL2J5bmZvci9hdXRoL3VzZXJfcHJvZmlsZXMvMjgwMDg4X29yaWdpbmFsX0J5bmZvci5wbmciLCJyYXRpbmdzIjowLjAsImppZCI6InNwYXRlbEB4YW1wcC5ieW5mb3IuY29tIiwib3BlbmZpcmVQYXNzd29yZCI6IlpOSjA0SDgifX0.XAMTRd9yYQRn_-DBS9zIWcmfmLAaTWQ-EpAcKAdbcNA; token_type=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzcGF0ZWwiLCJzY29wZSI6WyJjdXN0b21lcmZyb250ZW5kIiwid2ViY2xpZW50Il0sImF0aSI6ImFkYmEzOWE2LTlmYzUtNGEwYS1hY2I2LWFhZjY0OTY1N2YzZSIsImV4cCI6MTY2Mzc3ODkxNSwiYXV0aG9yaXRpZXMiOlsiQ1VTVE9NRVIiXSwianRpIjoiZGRlMzYyNzgtMTBiNS00YzVmLWJhOWUtODhlZGYwMTM5NzQ1IiwiY2xpZW50X2lkIjoiand0Y2xpZW50IiwiVXNlclRva2VuIjp7ImlkIjo5MzIyLCJ1c2VybmFtZSI6InNwYXRlbCIsInBhc3N3b3JkIjoiNzhlNDFhODQ3NmM1NDIyNmZhMGE0MjJjNTBjN2RjNTlhZWQ1MzJhOGNiYWJlMDQ4MTgyYzI1OTVmMGRhMmMyNiIsImZpcnN0bmFtZSI6IlNhbmtldCIsImxhc3RuYW1lIjoiUGF0ZWwiLCJtZXJjaGFudCI6eyJpZCI6MSwicGhvbmUiOm51bGwsImVtYWlsIjpudWxsLCJzdG9yZU5hbWUiOm51bGwsInN0b3JlQ29kZSI6bnVsbH0sImNvdW50cnlOYW1lIjoiVW5pdGVkIFN0YXRlcyIsInVzZXJDcmVhdGVkRGF0ZSI6MTY1MjkwMzI5NzAwMCwicHJvZmlsZUltZ1VybCI6Imh0dHBzOi8vc2Z0cC5ieW5mb3IuY29tL2J5bmZvci9hdXRoL3VzZXJfcHJvZmlsZXMvMjgwMDg4X29yaWdpbmFsX0J5bmZvci5wbmciLCJyYXRpbmdzIjowLjAsImppZCI6InNwYXRlbEB4YW1wcC5ieW5mb3IuY29tIiwib3BlbmZpcmVQYXNzd29yZCI6IlpOSjA0SDgifX0.XAMTRd9yYQRn_-DBS9zIWcmfmLAaTWQ-EpAcKAdbcNA; expires_in=Tue%20Aug%2022%202023%2012%3A48%3A34%20GMT-0400%20(Eastern%20Daylight%20Time); scope=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzcGF0ZWwiLCJzY29wZSI6WyJjdXN0b21lcmZyb250ZW5kIiwid2ViY2xpZW50Il0sImF0aSI6ImFkYmEzOWE2LTlmYzUtNGEwYS1hY2I2LWFhZjY0OTY1N2YzZSIsImV4cCI6MTY2Mzc3ODkxNSwiYXV0aG9yaXRpZXMiOlsiQ1VTVE9NRVIiXSwianRpIjoiZGRlMzYyNzgtMTBiNS00YzVmLWJhOWUtODhlZGYwMTM5NzQ1IiwiY2xpZW50X2lkIjoiand0Y2xpZW50IiwiVXNlclRva2VuIjp7ImlkIjo5MzIyLCJ1c2VybmFtZSI6InNwYXRlbCIsInBhc3N3b3JkIjoiNzhlNDFhODQ3NmM1NDIyNmZhMGE0MjJjNTBjN2RjNTlhZWQ1MzJhOGNiYWJlMDQ4MTgyYzI1OTVmMGRhMmMyNiIsImZpcnN0bmFtZSI6IlNhbmtldCIsImxhc3RuYW1lIjoiUGF0ZWwiLCJtZXJjaGFudCI6eyJpZCI6MSwicGhvbmUiOm51bGwsImVtYWlsIjpudWxsLCJzdG9yZU5hbWUiOm51bGwsInN0b3JlQ29kZSI6bnVsbH0sImNvdW50cnlOYW1lIjoiVW5pdGVkIFN0YXRlcyIsInVzZXJDcmVhdGVkRGF0ZSI6MTY1MjkwMzI5NzAwMCwicHJvZmlsZUltZ1VybCI6Imh0dHBzOi8vc2Z0cC5ieW5mb3IuY29tL2J5bmZvci9hdXRoL3VzZXJfcHJvZmlsZXMvMjgwMDg4X29yaWdpbmFsX0J5bmZvci5wbmciLCJyYXRpbmdzIjowLjAsImppZCI6InNwYXRlbEB4YW1wcC5ieW5mb3IuY29tIiwib3BlbmZpcmVQYXNzd29yZCI6IlpOSjA0SDgifX0.XAMTRd9yYQRn_-DBS9zIWcmfmLAaTWQ-EpAcKAdbcNA; login_type=OTHERS; _xsrf=2|40d0a006|6414e49faa7dbee06e07e4d7a6a4587c|1674163066; _ga=GA1.1.392914833.1675797030; _currentLang=en',
  //   };
  //   axios.post('http://192.168.10.108:8888', formData, {
  //     headers: headers
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

}
