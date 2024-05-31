import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataMessagingService<T> {
  private data = new ReplaySubject<T>();
  data$ = this.data.asObservable();

  sendData(data: T) {
    console.log('Sending data from dataExchangeService', data);
    this.data.next(data);
  }
}
