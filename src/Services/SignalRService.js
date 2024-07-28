// SignalRService.js
import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.hubConnection = null;
  }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7042/PayHub")
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  // registerTransactionId = (id) => {
  //   if (this.hubConnection) {
  //     this.hubConnection.invoke("RegisterTransaction", id)
  //       .catch(err => console.log('Error while registering transaction: ' + err));
  //   }
  // }

  paymentResult = (updateStatus) => {
    console.log("trigger payment result inner")
    if (this.hubConnection) {
      this.hubConnection.on("MessageForSocket", (res) => {
        console.log("trigger res crazy boy miami",res)
        updateStatus(res);
      });
    }
  }
}

export default new SignalRService();
