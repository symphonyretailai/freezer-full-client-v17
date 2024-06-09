import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataMessagingService {
  private data = new Subject<{ sender: string, recipient: string, data: string }>();
  data$ = this.data.asObservable();

  sendData(sender: string, recipient: string, data: string) {
    this.data.next({ sender, recipient, data });
  }
}
