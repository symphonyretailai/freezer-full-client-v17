import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataExchangeService {
  private data = new ReplaySubject<string>();
  data$ = this.data.asObservable();

  sendData(data: string) {
    console.log('Sending data from dataExchangeService', data);
    this.data.next(data);
  }
}
