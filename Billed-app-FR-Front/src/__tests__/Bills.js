/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { screen, waitFor, fireEvent, render } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { DashboardUI } from "../views/DashboardUI";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon).toHaveAttribute("id", "layout-icon1");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);

      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("Then should be existe button new bill", () => {
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      expect(buttonNewBill.textContent.trim()).toBe("Nouvelle note de frais");
    });
  });
});

/**
 * @jest-environment code
 */

// {"type":"Employee","email":"employee@test.tld","password":"employee","status":"connected"}

describe("Given I am connected as employee and I am on Dashboard page ", () => {
  describe("When I click on the icon eye", () => {
    it("Then A modal should open", () => {
      const handleClickIconEye = jest.fn(screen.handleClickIconEye);
      const eyes = screen.getAllByTestId("icon-eye");
      const eye = eyes[0];
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFileEmployee");
      expect(modale).toBeTruthy();
    });
    it("Then add a test function should be called", () => {
      const eyeButtons = screen.getAllByTestId("icon-eye");
      const firstEyeButton = eyeButtons[0];
      function handleClickIconEye() {
        const modalElement = document.createElement("div");
        modalElement.setAttribute("data-testid", "test");
        document.body.appendChild(modalElement);
      }
      /**
       *  événements "click" à firstEyeButton
       */
      firstEyeButton.addEventListener("click", handleClickIconEye());
      // Vérifiez que la modal est visible
      const modal = screen.getByTestId("test");
      expect(modal).toBeVisible();
    });

    it("Then should set the image source based on bill URL", () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      $.fn.modal = jest.fn();
      const icon = document.createElement("div");
      icon.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(icon);

      bills.handleClickIconEye(icon);

      const billUrl = icon.getAttribute("data-bill-url");
      const img = screen.getByTestId("image");

      if (billUrl === "http://localhost:5678/null") {
        expect(img.src).toBe(
          "http://localhost:5678/public/6f7d29b2d76705b28fce20f897d08854"
        );
      } else {
        expect(img.src).toBe(billUrl);
      }
      // Vérifiez si l'élément modal est visible
      waitFor(() => {
        const modal = document.getElementById("modaleFile");
        expect(modal.style.display).toBe("block");
      });
    });

    it("Should calculate imgWidth based on modalFile width", () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      $.fn.modal = jest.fn();
      const modalFile = document.createElement("div");
      modalFile.id = "modaleFile";
      modalFile.style.width = "400px";
      document.body.appendChild(modalFile);
   
       setTimeout(() => {
        expect(bills.imgWidth).toBe(200);
          done(); // Appelé pour indiquer la fin du test asynchrone
       }, 0);
    });
  });
  ///je dois travailler sur ca
  // describe('When I click on the Download icon', () => {
  //   it("Then should set the Download source based on bill URL", async () => {
  //     const onNavigate = jest.fn();
  //     const bills = new Bills({
  //       document: document,
  //       onNavigate: onNavigate,
  //       store: null,
  //       localStorage: null,
  //     });

  //     const icon = document.createElement("div");
  //     icon.setAttribute("data-bill-url", "http://localhost:5678/null");
  //     document.body.append(icon);

  //     await waitFor(() => {

  //       bills.handleClickDownload(icon);
  //       window.jsPDF = window.jspdf.jsPDF;
  //       const billUrl = icon.getAttribute("data-bill-url");
  //       const img = document.querySelector("img");

  //       if (billUrl === "http://localhost:5678/null") {
  //         expect(img.src).toBe("http://localhost:5678/public/6f7d29b2d76705b28fce20f897d08854");
  //       } else {
  //         expect(img.src).toBe(expect.url);
  //       }
  //     });
  //   });
  // });

  describe("When I click on buttonNewBill", () => {
    it("Then onNavigate should be called with ROUTES_PATH['NewBill']", () => {
      //add mock for onNavigate
      const onNavigate = jest.fn();
      // Instanciez la classe Bills
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      // cree le btn buttonNewBill
      const buttonNewBill = document.createElement("button");
      buttonNewBill.setAttribute("data-testid", "btn-new-bill");
      document.body.appendChild(buttonNewBill);

      // Appele la méthode handleClickNewBill de l'instance de Bills
      bills.handleClickNewBill();
      // Vérifiez que la fonction onNavigate a été appelée avec la route correcte
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });
  });
});
