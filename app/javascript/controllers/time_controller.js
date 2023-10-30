import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="time"
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
    const createdAt = new Date(this.createdAtValue * 1000); // Convertir en millisecondes
    const timeElement = this.timeTarget;

    const diffInSeconds = (now - createdAt) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    if (diffInSeconds < 1) { // 0 seconde
      timeElement.textContent = `à l'instant`;
    } else if (diffInSeconds < 60) { // moins d'une minute
      timeElement.textContent = `il y a ${Math.round(diffInSeconds)} secondes`;
    } else if (diffInMinutes < 2) { // moins de 2 minutes
      timeElement.textContent = `il y a 1 minute`;
    } else if (diffInMinutes < 10) { // moins de 10 minutes
      timeElement.textContent = `il y a ${Math.round(diffInSeconds / 60)} minutes`;
    } else if (diffInDays < 1) { // moins de 24 heures {
      const hours = createdAt.getHours().toString().padStart(2, '0');
      const minutes = createdAt.getMinutes().toString().padStart(2, '0');
      timeElement.textContent = `${hours}:${minutes}`;
    } else if (diffInDays < 2) { // moins de 2 jours
      timeElement.textContent = `hier à ${createdAt.getHours()}:${createdAt.getMinutes()}`;
    } else if (diffInDays < 30) { // moins de 30 jours
      timeElement.textContent = `il y a ${Math.round(diffInDays)} jours`;
    } else {
      const month = createdAt.getMonth() + 1;
      const day = createdAt.getDate();
      const year = createdAt.getFullYear();
      timeElement.textContent = `le ${day}/${month}/${year}`;
    }
  }

  startRefreshing() {
    this.refreshInterval = setInterval(() => {
      this.updateTime();
    }, 10000);
  }

  stopRefreshing() {
    clearInterval(this.refreshInterval);
  }
}
