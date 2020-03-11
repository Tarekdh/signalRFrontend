import {Component, OnInit} from '@angular/core';
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@aspnet/signalr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'signalRFrontend';
  message = '';
  userName = 'Tarek'.concat(Math.round(Math.random() * 100).toString());
  private hubConnection: HubConnection;
  messages = [];

  ngOnInit(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:44319/chathub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connecté au hub');
      })
      .catch(error => console.error('Problème de connexion au hub: ' + error));
    this.hubConnection.on("ReceiveMessage", (message) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.hubConnection.invoke("SendMessage", this.userName, this.message)
      .catch(err => console.error(err.toString()));
    this.messages.push(this.message);
    this.message = '';


  }
}
