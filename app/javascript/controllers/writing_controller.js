import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

let writingTimeout;

// Connects to data-controller="writing"
export default class extends Controller {

  connect() {
    document.addEventListener('message-sent', this.stopWriting.bind(this));
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

  startWriting(event) {
    if (!(event.key == "Enter")) {
      this.subscription.perform("start_writing");
    }
  }

  stopWriting() {
    this.subscription.perform("stop_writing");
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
    if (data.writing && current_user_name != writer_user_name && !document.getElementById(`writing-${data.user_name}`)) {

      this.element.insertAdjacentHTML("beforebegin", `<small id="writing-${data.user_name}" class="fw-light"><span class="fw-bold">${writer_user_name}</span> is writing...</small>`)
      this.clearTimeout(writingTimeout);
      this.setTimeout(data);
      this.scrollToBottom();
      console.log(data);
    } else if (!data.writing) {
      const writingElement = document.getElementById(`writing-${data.user_name}`);
      if (writingElement) {
        writingElement.remove();
      }
    }
  } 

  setTimeout(data) {
    // Set new timer
    writingTimeout = setTimeout(() => {
      const writingElement = document.getElementById(`writing-${data.user_name}`);
      if (writingElement) {
        writingElement.remove();
      }
    }, 2500);
  }

  clearTimeout(timeout) {
    // Clear previous timer
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
