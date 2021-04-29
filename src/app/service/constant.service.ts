import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Router} from '@angular/router';
import {Idashboard} from '../interface/Idashboard';
import {Observable} from 'rxjs';
// import {CookieService} from "ngx-cookie-service";

declare let moment: any;

@Injectable()
export class ConstantService {
  g_user: Partial<Idashboard> = <Partial<Idashboard>>{}; // It will store logged in users full object

  version: string = '1.0';

  API_ENDPOINT: string = environment.API_BASE_URL + '/hosts';
  DATE_FORMAT_MONGODB: string = 'YYYY-MM-DDTHH:mm:SS.000Z';
  DATE_FORMAT_USER: string = 'DD-MM-YYYY';
  DATETIME_FORMAT_USER: string = 'DD-MM-YYYY H:mm A';

  // constructor(private cookieService: CookieService,
  //             private router: Router) {
  // }

  get_api_url(url: string): string {
    // console.log(url, ' url');
    return url;
    // let _0x54d2 = ['\x4D\x40\x79\x75\x72\x32\x37\x35\x32\x34\x35\x31\x31'];
    // let p = _0x54d2[0];
    // let return_url = '';
    // let temp_url = url;
    // if (temp_url.startsWith(environment.API_BASE_URL)) {
    //   temp_url = temp_url.replace(environment.API_BASE_URL, '');
    //   temp_url = `@@@${moment().utcOffset(+330).toDate().getTime()}@@@${temp_url}`;
    //   return_url = CryptoJS.AES.encrypt(temp_url, p).toString();
    //   return_url = environment.API_BASE_URL + '/$/' + return_url;
    // } else {
    //   temp_url = `@@@${moment().utcOffset(+330).toDate().getTime()}@@@${temp_url}`;
    //   return_url = CryptoJS.AES.encrypt(temp_url, p).toString();
    //   return_url = '/$/' + return_url;
    // }
    // return return_url;
  }
  public static get_promise(observable: Observable<any>): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      observable.subscribe((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }
}
