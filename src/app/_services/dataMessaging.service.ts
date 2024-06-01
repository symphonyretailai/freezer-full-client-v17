import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataMessagingService {
  private data = new ReplaySubject<{ sender: string, recipient: string, data: string }>();
  data$ = this.data.asObservable();

  sendData(sender: string, recipient: string, data: string) {
    console.log('Sending data from dataExchangeService sender: ', sender, ' recipient: ', recipient, " data: ", data);
    this.data.next({ sender, recipient, data });
  }
}
