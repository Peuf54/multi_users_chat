import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

let writingTimeout;

// Connects to data-controller="writing"
export default class extends Controller {

  connect() {
    this.channel_id = document.querySelector('meta[name="current_channel_id"]').getAttribute('content');
    this.subscription = consumer.subscriptions.create({ channel: "MessageChannel", id: this.channel_id }, {
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

  startWriting() {
    this.subscription.perform("start_writing");
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  _received(data) {
    const current_user_name = document.querySelector('meta[name="current_user_name"]').getAttribute('content');
    const writer_user_name = data.user_name;

    // If action 'writing' is true from MessageChannel's broadcast, writer's name is different than current_user, and the writing element doesn't exist yet, then insert it
    if (data.writing && current_user_name != writer_user_name && !document.getElementById(`writing-${data.user_id}`)) {

      this.element.insertAdjacentHTML("beforebegin", `<small id="writing-${data.user_id}" class="fw-light"><span class="fw-bold">${writer_user_name}</span> is writing...</small>`)
      this.scrollToBottom();

      // Clear old timers if existing
      if (writingTimeout) {
        clearTimeout(writingTimeout)
      }

      // Set new timer
      writingTimeout = setTimeout(() => {
        const writingElement = document.getElementById(`writing-${data.user_id}`);
        if (writingElement) {
          writingElement.remove();
        }
      }, 2500);
    }
  } 
}
