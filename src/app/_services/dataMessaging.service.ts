import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataMessagingService {
  private data = new ReplaySubject<{ sender: string, recipient: string, data: string }>();
  data$ = this.data.asObservable();

  sendData(sender: string, recipient: string, data: string) {
    this.data.next({ sender, recipient, data });
  }
}
