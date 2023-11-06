// import jsPDF from 'jspdf';
import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";
import { notFound } from "../views/notFound.js";


export default class Bills {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
    const iconDownload = document.querySelectorAll(
      `a[data-testid="download-link-blue"]`
    );
    if (iconDownload)
      iconDownload.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickDownload(icon));
      });

    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    if (billUrl === "http://localhost:5678/null") {
      const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
      $("#modaleFile")
        .find(".modal-body")
        .html(
          `<div style='text-align: center;' class="bill-proof-container"><img  data-testid="image" width="100%" src=${notFound} alt="Bill" /></div>`
        );
      $("#modaleFile").modal("show");
    } else {
      const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
      $("#modaleFile")
        .find(".modal-body")
        .html(
          `<div style='text-align: center;' class="bill-proof-container"><img  data-testid="image"  width="100%" src=${billUrl} alt="Bill" /></div>`
        );
      $("#modaleFile").modal("show");
    }
  };

  handleClickDownload = async (icon) => {
  
    window.jsPDF = window.jspdf?.jsPDF;
    const doc = new jsPDF();
    
    const image = new Image();
    if (icon?.getAttribute("data-bill-url") === "http://localhost:5678/null") {
      image.src = `${notFound}`;
    } else {
      image.src = icon?.getAttribute("data-bill-url");
    }

    doc.addImage(image, "png", 15, 40, 180, 160);
    const pdfdow = await doc.save("fichier" + ".pdf");
    const downloadLink = $("#download-link");
  };

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
            } catch (e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e, "for", doc);
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status),
              };
            }
          });
          console.log("length", bills.length);
          return bills;
        });
    }
  };
}
