import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets = ["pill"]; // Mettre à jour ce target pour correspondre à l'élément qui affiche le nombre de messages non lus

  connect() {
    this.subscription = consumer.subscriptions.create({ channel: "UnreadsChannel", id: this.data.get("id") }, {
      connected: this._connected.bind(this),
      disconnected: this._disconnected.bind(this),
      received: this._received.bind(this)
    });
  }

  disconnect() {
    consumer.subscriptions.remove(this.subscription);
  }

  _connected() {
  }

  _disconnected() {
  }

  _received(data) {
    if (data.new_message) {
      const channel_id = data.channel_id;
      
      const url = `/api/v1/channels/${channel_id}/unreads_amount`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          if (data.unreads_amount > 0) {
            this.pillTarget.innerHTML = data.unreads_amount; 
          }
        });
    }
  }
}
