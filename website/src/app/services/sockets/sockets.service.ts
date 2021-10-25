import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketConnection } from './socket-connection.service';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { userInfo } from 'os';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  constructor(private socket: SocketConnection,
    @Inject(LOCAL_STORAGE) private localStorage: any,
  ) { }
  // private messageIdSource: BehaviorSubject<string> = new BehaviorSubject(null);
  // getMessageId: Observable<string> = this.messageIdSource.asObservable();
  setMessageId(data: string, supplier_id?: string) {
    let messageId = {
      supplierId: supplier_id || '',
      messageId: data
    }
    localStorage.setItem('supplierMessageId', JSON.stringify(messageId))
  }

  getMessageId() {
    let data = JSON.parse(localStorage.getItem('supplierMessageId'))
    return data
  }



  getLocation(): Observable<any> {
    return this.socket
      .fromEvent("order_location").pipe(
        map(data => {
          return data;
        }));
  }

  removeListener(eventName: string) {
    this.socket.removeAllListeners(eventName);
    this.socket.disconnect();
  }

  // connectListner() {
  //   if(localStorage.getItem('web_user')) {
  //   this.socket.connect()
  // }
  // }

  sendMessage(msg: any) {
    console.log(msg)
    this.socket.emit('sendMessage', msg, (response) => { console.log(response) });
  }

  joinRoom(payload: any, supplierId?: any) {
    console.log('joinRoom', payload)
    this.socket.emit('join_room', payload, (response) => {
      console.log(response)
      if (supplierId) {
        this.setMessageId(response.data.room_id, supplierId)
      }  else {
        let user = JSON.parse(localStorage.getItem('web_user')) 
        user.message_id = response.data.room_id
        localStorage.setItem('web_user',JSON.stringify(user))
      }
    });
  }

  getSendMessage(): Observable<any> {
    return this.socket
      .fromEvent("sendMessage").pipe(
        map(data => {
          return data;
        }));
  }

  getMessage(): Observable<any> {
    return this.socket
      .fromEvent("receiveMessage").pipe(
        map(data => {
          return data;
        }));
  }

}