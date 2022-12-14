import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantService} from './constant.service';
// import {CookieService} from 'ngx-cookie-service';
import {Idashboard} from '../interface/Idashboard';

@Injectable()
export class DashboardService {

  // url = '/notes/';

  cloneObj: Idashboard = <any>undefined;
  editObj: Idashboard = <any>undefined;

  constructor(private http: HttpClient, public constantService: ConstantService) {
  }

  delete_soft(_id: string) {
    return this.http.put(this.constantService.get_api_url(this.constantService.API_ENDPOINT + 'delete_soft/' + _id), {
      _id: _id,
      active: 0
    });
  }

  delete(_id: string) {
    return this.http.post(this.constantService.get_api_url(this.constantService.API_ENDPOINT + `/host-delete`), {data: this.constantService.getEncryptedData(_id)});
  }

  save(data: Partial<Idashboard>) {
    return this.http.post(this.constantService.get_api_url(this.constantService.API_ENDPOINT + '/host-save'), {
      data: this.constantService.getEncryptedData(data)
    });
  }

  update(data: Partial<Idashboard>) {
    return this.http.put(this.constantService.get_api_url(this.constantService.API_ENDPOINT + '/update'),
      {
        data: this.constantService.getEncryptedData(data),
        id: this.constantService.getEncryptedData(data._id),
      }
    );
  }

  get(_id: string, populate?: string) {
    return this.http.get<Partial<Idashboard>>(this.constantService.get_api_url(this.constantService.API_ENDPOINT + _id + `${populate ? '?populate=' + populate : ''}`));
  }

  // latestPull() {
  //   return this.http.get<Partial<Idashboard>>(this.constantService.get_api_url(this.constantService.API_ENDPOINT + '/latestPull'));
  // }

  async hostMetricsData(_id: any) {
    let resp: any;
    if (_id) {
      resp = await this.http.get<Partial<Idashboard>[]>(this.constantService.get_api_url(this.constantService.API_ENDPOINT + '/hostMetrics/' + _id)).toPromise();
      // console.log(resp);
    }
    return JSON.parse(this.constantService.getDecryptedData(resp.data));
  }

  async list(select?: string) {
    let resp: any;
    if (select) {
      resp = await this.http.get<Partial<Idashboard>[]>(this.constantService.get_api_url(this.constantService.API_ENDPOINT + `select=${select}`)).toPromise();
    } else {
      resp = await this.http.get<Partial<Idashboard>[]>(this.constantService.get_api_url(this.constantService.API_ENDPOINT)).toPromise();
    }
    return JSON.parse(this.constantService.getDecryptedData(resp.data));
  }

  query(query: any) {
    return this.http.post<Partial<Idashboard>[]>(this.constantService.get_api_url(this.constantService.API_ENDPOINT + `query`), query);
  }
}
