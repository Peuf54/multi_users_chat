import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

// Connects to data-controller="channel"
export default class extends Controller {
  static targets = ["messages", "input", "messagesContainer"]

  connect() {
    this.subscription = consumer.subscriptions.create({ channel: "MessageChannel", id: this.data.get("id") }, {
      connected: this._connected.bind(this),
      disconnected: this._disconnected.bind(this),
      received: this._received.bind(this)
    });
  }

  disconnect() {
    consumer.subscriptions.remove(this.subscription);
  }

  _connected() {
    this.scrollToBottom();
  }

  _disconnected() {

  }

  _received(data) {
    if (data.message) {
      const lastReadLine = this.element.querySelector("#last-read-line");
      const messageUserId = data.message_user_id;
      const currentUserId = this.data.get("currentUserId");

      if (!lastReadLine && messageUserId != currentUserId) {
        this.messagesTarget.insertAdjacentHTML("beforeend", '<div id="last-read-line" class="border-bottom border-danger"></div>');
      }
      this.messagesTarget.insertAdjacentHTML("beforeend", data.message);
      this.scrollToBottom();
      if (document.hidden) {
        const messages_alert = new Audio('/audio/messages_alert.mp3');
        messages_alert.play();
      }
    } else if (data.alert) {
      const navElement = document.querySelector('nav');
      if (navElement) {
        navElement.insertAdjacentHTML("afterend", data.alert);
      }
      this.scrollToTop();
    }
    
  }

  touch() {
    this.subscription.perform("touch");
    setTimeout(() => {
      const lastReadLine = this.element.querySelector("#last-read-line");
      if (lastReadLine) {
        lastReadLine.remove();
      }
    }, 5000);
  }

  clearInput(event) {
    this.inputTarget.value = "";
    this.touch();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  scrollToBottom() {
    const lastReadLine = this.messagesContainerTarget.querySelector("#last-read-line");
    const containerOffset = this.messagesContainerTarget.offsetTop;
    
    if (lastReadLine) {
      const position = lastReadLine.offsetTop - containerOffset;
      this.messagesContainerTarget.scrollTo(0, position);
    } else {
      this.messagesContainerTarget.scrollTo(0, this.messagesTarget.scrollHeight - containerOffset);
    }
  }   
}
