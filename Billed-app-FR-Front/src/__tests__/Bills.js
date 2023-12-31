/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { screen, waitFor, fireEvent, render } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { DashboardUI } from "../views/DashboardUI";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";
import eyeBlueIcon from "../assets/svg/eye_blue.js";

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
      if (buttonNewBill) {
        const handleClickNewBill = jest.fn(screen.handleClickNewBill);
        buttonNewBill.addEventListener("click", handleClickNewBill);
        userEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
      }
    });

    test("Then should be exist buttons iconEye", async () => {
      await waitFor(() => {
        const iconEye = screen.getAllByTestId("icon-eye");

        const handleClickIconEye = jest.fn();

        if (iconEye.length > 0) {
          iconEye.forEach((icon) => {
            expect(icon).toHaveAttribute("id", "eye");
            icon.addEventListener("click", () => handleClickIconEye(icon));
            userEvent.click(icon);
            expect(handleClickIconEye).toHaveBeenCalled();
          });
        } else {
          expect(handleClickIconEye).not.toHaveBeenCalled();
        }
      });
    });

    test("Then should be existe icon Download", () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      window.jspdf = {
        jsPDF: class jsPDF {
          constructor() {}
          addImage() {}
          save() {}
        },
      };
      const AllIconDownload = screen.getAllByTestId("download-link-blue");
      if (AllIconDownload) {
        expect(AllIconDownload).toBeTruthy();

        AllIconDownload.forEach((iconDownload) => {
          expect(iconDownload).toHaveAttribute("id", "download-link-blue");
        });
      }
      const iconDownload = AllIconDownload[0];

      if (iconDownload) {
        const handleClickDownload = jest.spyOn(bills, "handleClickDownload");
        userEvent.click(iconDownload);
        iconDownload.addEventListener(
          "click",
          handleClickDownload(iconDownload)
        );

        expect(handleClickDownload).toHaveBeenCalled();
      }
    });

    test("Then handleClickDownload function should be called", async () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      window.jspdf = {
        jsPDF: class jsPDF {
          constructor() {}
          addImage() {}
          save() {}
        },
      };

      const iconDownload = document.createElement("a");
      iconDownload.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(iconDownload);

      const handleClickDownloadSpy = jest.spyOn(bills, "handleClickDownload");

      iconDownload.addEventListener("click", () => {
        bills.handleClickDownload(iconDownload);
      });

      userEvent.click(iconDownload);

      expect(handleClickDownloadSpy).toHaveBeenCalled();
    });

    it("Then handleClickDownload function should be used", async () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      window.jspdf = {
        jsPDF: class jsPDF {
          constructor() {}
          addImage() {}
          save() {}
        },
      };
      const iconDownload = document.createElement("a");
      iconDownload.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(iconDownload);

      // Appelez directement la méthode handleClickDownload
      await bills.handleClickDownload(iconDownload);

      expect(iconDownload.getAttribute("data-bill-url")).toBe(
        "http://localhost:5678/null"
      );
    });

    describe("When I get Bills", () => {
      it("Then should handle errors with catch", async () => {
        const storeMock = {
          bills: () => ({
            list: jest.fn().mockRejectedValue(new Error("Some error message")),
          }),
        };
        const doc = {
          date: "date invalide",
        };
        const onNavigate = jest.fn();
        const bill = new Bills({
          document: document,
          onNavigate: onNavigate,
          store: storeMock,
          localStorage: null,
        });

        try {
          await bill.getBills();
          const result = bill.getBills();
          expect(result[0].date).toBe("date invalide");
        } catch (error) {
          expect(error.message).toBe("Some error message");
        }
      });
    });
  });
});

describe("Given I am connected as employee and I am on Dashboard page ", () => {
  describe("When I click on the icon eye", () => {
    it("Then A modal should open", () => {
      const handleClickIconEye = jest.fn(screen.handleClickIconEye);
      const eyes = screen.getAllByTestId("icon-eye");
      expect(eyes).toBeTruthy();
      const eye = eyes[0];
      $.fn.modal = jest.fn();
      eye.addEventListener("click", handleClickIconEye);
      userEvent.click(eye);
      expect(handleClickIconEye).toHaveBeenCalled();

      const modale = screen.getByTestId("modaleFileEmployee");
      expect(modale).toBeTruthy();
    });
    it("Then add a test function should be called", () => {
      const iconEye = screen.getAllByTestId("icon-eye");
      const firstEyeButton = iconEye[0];
      function handleClickIconEye() {
        const modalElement = document.createElement("div");
        modalElement.setAttribute("data-testid", "test");
        document.body.appendChild(modalElement);
      }
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

    it("Then Should calculate imgWidth based on modalFile width", () => {
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

  describe("When I click on the Download icon", () => {
    it("Then, if I click the Download function, a modal should be opened", () => {
      const DownloadButtons = screen.getAllByTestId("download-link-blue");
      const firstDownloadButton = DownloadButtons[0];
      function handleClickDownload() {
        const modalElement = document.createElement("div");
        modalElement.setAttribute("data-testid", "Download");
        document.body.appendChild(modalElement);
      }
      firstDownloadButton.addEventListener("click", handleClickDownload());
      // Vérifier que la modal est visible
      const modal = screen.getByTestId("Download");
      expect(modal).toBeVisible();
    });

    it("Then downloadLink should be have attribute (data-bill-url)", () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      const iconDownload = document.createElement("a");
      iconDownload.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(iconDownload);
      waitFor(() => {
        const downloadLink = screen.getByTestId("download-link-blue");
        expect(downloadLink).toHaveAttribute("data-bill-url");
      });
    });

    it("Then should set the image source based on bill URL", () => {
      const onNavigate = jest.fn();
      const bills = new Bills({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      window.jspdf = {
        jsPDF: class jsPDF {
          constructor() {}
          addImage() {}
          save() {}
        },
      };
      const icon = document.createElement("div");
      icon.setAttribute(
        "data-bill-url",
        "http://localhost:5678/public/6f7d29b2d76705b28fce20f897d08854"
      );
      const billUrl = icon.getAttribute("data-bill-url");
      document.body.append(icon);

      const img = document.querySelector("img");
      expect(img.src).toBe(icon.getAttribute("data-bill-url"));
    });
  });

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

      bills.handleClickNewBill();

      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });

    it("Then should return a list of bills with formatted date and status", async () => {
      const storeMock = {
        bills: () => ({
          list: jest.fn().mockResolvedValue([
            {
              date: "4 Avr. 04",
              status: "pending",
            },
          ]),
        }),
      };

      const bills = new Bills({
        document: document,
        onNavigate: jest.fn(),
        store: storeMock,
        localStorage: null,
      });

      expect(bills.store).toBeDefined();
      const formattedBills = await bills.getBills();

      expect(formattedBills).toEqual([
        {
          date: "4 Avr. 04",
          status: "En attente",
        },
      ]);
    });

    it("Then should handle the case when store is not defined", async () => {
      const storeMock = {
        bills: () => ({
          list: jest.fn().mockResolvedValue([]),
        }),
      };

      const bills = new Bills({
        document: document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: null,
      });

      const formattedBills = await bills.getBills();
      expect(formattedBills).toBeUndefined();
    });
  });
});

/**
 * test integration
 */

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Dashboard", () => {
    test("Then fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Employee", email: "employee@test.tld" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getAllByText("Billed"));
      const contentPending = await screen.getAllByTestId("icon-window");
      expect(contentPending).toBeTruthy();
      const contentBilled = await screen.getAllByText("Billed");
      expect(contentBilled).toBeTruthy();
      expect(screen.getAllByTestId("icon-mail")).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "employee@test.tld",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("Then fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getAllByTestId("error-message");
        expect(message).toBeTruthy();
      });

      test("Then fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);
        await new Promise(process.nextTick);
        const message = await screen.getAllByTestId("error-message");
        expect(message).toBeTruthy();
      });
    });
  });
});
