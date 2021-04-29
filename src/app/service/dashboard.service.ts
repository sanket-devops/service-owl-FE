import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantService} from './constant.service';
// import {CookieService} from 'ngx-cookie-service';
import {Idashboard} from '../interface/Idashboard';

@Injectable()
export class DashboardService {

  // url = '/notes/';

  constructor(private http: HttpClient, public ConstantService: ConstantService) {
  }

  delete_soft(_id: string) {
    return this.http.put(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + 'delete_soft/' + _id), {
      _id: _id,
      active: 0
    });
  }

  delete(_id: string) {
    return this.http.delete(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + _id));
  }

  save(data: Partial<Idashboard>) {
    return this.http.post(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT ), data);
  }

  update(data: Partial<Idashboard>) {
    return this.http.put(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + data._id), data);
  }

  get(_id: string, populate?: string) {
    return this.http.get<Partial<Idashboard>>(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + _id + `${populate ? '?populate=' + populate : ''}`));
  }

  latestPull() {
    return this.http.get<Partial<Idashboard>>(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT + '/latestPull'));
  }

  list(select?: string) {
    if (select) {
      return this.http.get<Partial<Idashboard>[]>(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + `select=${select}`));
    } else {
      return this.http.get<Partial<Idashboard>[]>(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT));
    }
  }

  query(query: any) {
    return this.http.post<Partial<Idashboard>[]>(this.ConstantService.get_api_url(this.ConstantService.API_ENDPOINT  + `query`), query);
  }
}
