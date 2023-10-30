import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["time"];
  static values = { createdAt: Number };

  connect() {
    this.updateTime();
    this.startRefreshing();
  }

  disconnect() {
    this.stopRefreshing();
  }

  updateTime() {
    const now = new Date();
    const createdAt = new Date(this.createdAtValue * 1000);
    this.timeTarget.textContent = this.formatTimeDifference(now, createdAt);
  }

  formatTimeDifference(now, createdAt) {
    const diffInSeconds = (now - createdAt) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const hours = createdAt.getHours().toString().padStart(2, '0');
    const minutes = createdAt.getMinutes().toString().padStart(2, '0');
    const month = createdAt.getMonth() + 1;
    const day = createdAt.getDate();
    const year = createdAt.getFullYear();

    // Réinitialiser le temps pour les deux dates à minuit
    const nowAtMidnight = new Date(now);
    nowAtMidnight.setHours(0, 0, 0, 0);
    const createdAtMidnight = new Date(createdAt);
    createdAtMidnight.setHours(0, 0, 0, 0);

    // Calculer la différence en jours entre aujourd'hui et la date de création
    const diffInDaysFromMidnight = Math.round((nowAtMidnight - createdAtMidnight) / (1000 * 60 * 60 * 24));

    if (diffInSeconds < 1) {
      return `à l'instant`;
    } else if (diffInSeconds < 60) {
      return `il y a ${Math.round(diffInSeconds)} secondes`;
    } else if (diffInMinutes < 2) {
      return `il y a 1 minute`;
    } else if (diffInMinutes < 60) {
      return `il y a ${Math.round(diffInMinutes)} minutes`;
    } else if (diffInDaysFromMidnight === 0) {
      return `${hours}:${minutes}`;
    } else if (diffInDaysFromMidnight === 1) {
      return `hier à ${hours}:${minutes}`;
    } else if (diffInDaysFromMidnight === 2) {
      return `avant-hier à ${hours}:${minutes}`;
    } else if (diffInDaysFromMidnight < 30) {
      return `il y a ${Math.round(diffInDaysFromMidnight)} jours`;
    } else {
      return `le ${day}/${month}/${year}`;
    }
  }


  startRefreshing() {
    this.refreshInterval = setInterval(() => this.updateTime(), 10000);
  }

  stopRefreshing() {
    clearInterval(this.refreshInterval);
  }
}
