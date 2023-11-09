/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import DashboardFormUI from "../views/DashboardFormUI.js";
import DashboardUI from "../views/DashboardUI.js";
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills";
import router from "../app/Router";
jest.mock("../app/store", () => mockStore);
import { notFound } from "../views/notFound.js";

/**
 * admin
 */
describe("Given I am connected as an Admin", () => {
  describe("When I am on Dashboard page, there are bills, and there is one pending", () => {
    test("Then, filteredBills by pending status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "pending");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is one accepted", () => {
    test("Then, filteredBills by accepted status should return 1 bill", () => {
      const filtered_bills = filteredBills(bills, "accepted");
      expect(filtered_bills.length).toBe(1);
    });
  });
  describe("When I am on Dashboard page, there are bills, and there is two refused", () => {
    test("Then, filteredBills by accepted status should return 2 bills", () => {
      const filtered_bills = filteredBills(bills, "refused");
      expect(filtered_bills.length).toBe(2);
    });
  });
  describe("When I am on Dashboard page but it is loading", () => {
    test("Then, Loading page should be rendered", () => {
      document.body.innerHTML = DashboardUI({ loading: true });
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("When I am on Dashboard page but back-end send an error message", () => {
    test("Then, Error page should be rendered", () => {
      document.body.innerHTML = DashboardUI({ error: "some error message" });
      expect(screen.getAllByText("Erreur")).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click on arrow", () => {
    test("Then, tickets list should be unfolding, and cards should appear", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = DashboardUI({ data: { bills } });

      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const handleShowTickets2 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 2)
      );
      const handleShowTickets3 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 3)
      );

      const icon1 = screen.getByTestId("arrow-icon1");
      const icon2 = screen.getByTestId("arrow-icon2");
      const icon3 = screen.getByTestId("arrow-icon3");

      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();
      await waitFor(() => screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`));
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();
      icon2.addEventListener("click", handleShowTickets2);
      userEvent.click(icon2);
      expect(handleShowTickets2).toHaveBeenCalled();
      await waitFor(() => screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`));
      expect(screen.getByTestId(`open-billUIUZtnPQvnbFnB0ozvJh`)).toBeTruthy();

      icon3.addEventListener("click", handleShowTickets3);
      userEvent.click(icon3);
      expect(handleShowTickets3).toHaveBeenCalled();
      await waitFor(() => screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`));
      expect(screen.getByTestId(`open-billBeKy5Mo4jkmdfPGYpTxZ`)).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click on edit icon of a card", () => {
    test("Then, right form should be filled", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = DashboardUI({ data: { bills } });
      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const icon1 = screen.getByTestId("arrow-icon1");
      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();
      const iconEdit = screen.getByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      userEvent.click(iconEdit);
      expect(screen.getByTestId(`dashboard-form`)).toBeTruthy();
    });
  });

  describe("When I am on Dashboard page and I click 2 times on edit icon of a card", () => {
    test("Then, big bill Icon should Appear", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );

      const dashboard = new Dashboard({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = DashboardUI({ data: { bills } });

      const handleShowTickets1 = jest.fn((e) =>
        dashboard.handleShowTickets(e, bills, 1)
      );
      const icon1 = screen.getByTestId("arrow-icon1");
      icon1.addEventListener("click", handleShowTickets1);
      userEvent.click(icon1);
      expect(handleShowTickets1).toHaveBeenCalled();
      expect(screen.getByTestId(`open-bill47qAXb6fIm2zOKkLzMro`)).toBeTruthy();
      const iconEdit = screen.getByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      userEvent.click(iconEdit);
      userEvent.click(iconEdit);
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });

  describe("When I am on Dashboard and there are no bills", () => {
    test("Then, no cards should be shown", () => {
      document.body.innerHTML = cards([]);
      const iconEdit = screen.queryByTestId("open-bill47qAXb6fIm2zOKkLzMro");
      expect(iconEdit).toBeNull();
    });
  });
});

describe("Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill", () => {
  describe("When I click on accept button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const acceptButton = screen.getByTestId("btn-accept-bill-d");
      const handleAcceptSubmit = jest.fn((e) =>
        dashboard.handleAcceptSubmit(e, bills[0])
      );
      acceptButton.addEventListener("click", handleAcceptSubmit);
      fireEvent.click(acceptButton);
      expect(handleAcceptSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
  describe("When I click on refuse button", () => {
    test("I should be sent on Dashboard with big billed icon instead of form", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      const refuseButton = screen.getByTestId("btn-refuse-bill-d");
      const handleRefuseSubmit = jest.fn((e) =>
        dashboard.handleRefuseSubmit(e, bills[0])
      );
      refuseButton.addEventListener("click", handleRefuseSubmit);
      fireEvent.click(refuseButton);
      expect(handleRefuseSubmit).toHaveBeenCalled();
      const bigBilledIcon = screen.queryByTestId("big-billed-icon");
      expect(bigBilledIcon).toBeTruthy();
    });
  });
});

describe("Given I am connected as Admin and I am on Dashboard page and I clicked on a bill", () => {
  describe("When I click on the icon eye", () => {
    test("Then should be existe buttons iconEye", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      const iconEye = screen.getByTestId("icon-eye-d");
      expect(iconEye).toBeTruthy();
      expect(iconEye).toBeDefined();
      expect(iconEye.getAttribute("id")).toBe("icon-eye-d");
    });
    test("Then a modal should open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      dashboard.handleClickIconEye();
      const eye = screen.getByTestId("icon-eye-d");
      userEvent.click(eye);
      eye.addEventListener("click", dashboard.handleClickIconEye());
      $.fn.modal = jest.fn();
      const modale = screen.getByTestId("modaleFileAdmin");
      expect(modale.getAttribute("id")).toBe("modaleFileAdmin1");
      expect(modale).toBeTruthy();
      expect(modale.getAttribute("aria-hidden")).toBe("true");
      expect(modale.getAttribute("class")).toBe("modal fade");
    });
    test("Then should set the image source based on bill URL", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });
      $.fn.modal = jest.fn();
      const icon = document.createElement("div");
      icon.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(icon);

      dashboard.handleClickIconEye();
      icon.addEventListener("click", dashboard.handleClickIconEye);
      $.fn.modal = jest.fn();
      userEvent.click(icon);
      const billUrl = icon.getAttribute("data-bill-url");
      const img = screen.getByTestId("image");

      if (billUrl === "http://localhost:5678/null") {
        expect(img.getAttribute("src")).not.toBe(billUrl);
        expect(img.src).toBe(
          "https://test.storage.tld/v0/b/billable-677b6.a%E2%80%A6f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
        );
      } else {
        expect(img.getAttribute("src")).toBe(billUrl);
      }
      // Vérifiez si l'élément modal est visible
      waitFor(() => {
        const modal = document.getElementById("modaleFileAdmin1");
        expect(modal.style.display).toBe("block");
      });
    });

    test("Then Should calculate imgWidth based on modalFile width", () => {
      const onNavigate = jest.fn();
      const dashboard = new Dashboard({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      $.fn.modal = jest.fn();
      const modalFile = document.createElement("div");
      modalFile.id = "modaleFileAdmin1";
      modalFile.style.width = "400px";
      document.body.appendChild(modalFile);
      expect(modalFile.getAttribute("id")).toBe("modaleFileAdmin1");
      setTimeout(() => {
        expect(dashboard.imgWidth).toBe(200);
        done();
      }, 0);
    });
  });
  /////////////////////////test

  describe("When I click on the Download icon", () => {
    test("Then should trigger the download function when the icon is clicked", () => {
      const download = jest.fn();
      const iconDownload = document.createElement("div");
      iconDownload.setAttribute("id", "icon-download");
      document.body.appendChild(iconDownload);
      iconDownload.addEventListener("click", download);
      userEvent.click(iconDownload);
      expect(download).toHaveBeenCalled();
    });

    it("Then downloadLink should be have attribute (data-bill-url)", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Admin",
        })
      );
      document.body.innerHTML = DashboardFormUI(bills[0]);
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      const dashboard = new Dashboard({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const iconDownload = document.createElement("a");
      iconDownload.setAttribute("data-bill-url", "http://localhost:5678/null");
      document.body.append(iconDownload);
      waitFor(() => {
        const downloadLink = screen.getByTestId("download-link");
        expect(downloadLink).toHaveAttribute("data-bill-url");
      });
    });
    it("Then should set the image source based on bill URL", () => {
      const onNavigate = jest.fn();
      const dashboard = new Dashboard({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      const icon = document.createElement("div");
      const billUrl =
        "http://localhost:5678/public/6f7d29b2d76705b28fce20f897d08854";
      icon.setAttribute("data-bill-url", billUrl);
      document.body.appendChild(icon);
      dashboard.handleClickIconEye();
      const img = document.querySelector("img[data-testid='image']");
      expect(img).toBeTruthy();
      expect(img.src).toBe(
        "https://test.storage.tld/v0/b/billable-677b6.a%E2%80%A6f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      );
    });
    it("Then handleClickDownload function should be used", async () => {
      const onNavigate = jest.fn();
      const dashboard = new Dashboard({
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
      await dashboard.handleClickDownload();

      expect(iconDownload.getAttribute("data-bill-url")).toBe(
        "http://localhost:5678/null"
      );
      const handleClickDownload = jest.spyOn(dashboard, "handleClickDownload");
      iconDownload.addEventListener("click", handleClickDownload);
      userEvent.click(iconDownload);
      expect(handleClickDownload).toHaveBeenCalled();
    });
    test("Then should set the image source to notFound when the URL is 'http://localhost:5678/null'", () => {
      const onNavigate = jest.fn();
      const dashboard = new Dashboard({
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
      icon.setAttribute("id", "icon-download");
      icon.setAttribute("data-bill-url", notFound);
      const billUrl = icon.getAttribute("data-bill-url");
      document.body.append(icon);

      const img = document.querySelector("img");
      expect(img.src).toBe(
        "https://test.storage.tld/v0/b/billable-677b6.a%E2%80%A6f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      );
      expect(icon.getAttribute("data-bill-url")).toBe(notFound);
    });
  });
});

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      localStorage.setItem(
        "user",
        JSON.stringify({ type: "Admin", email: "a@a" })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Dashboard);
      await waitFor(() => screen.getByText("Validations"));
      const contentPending = await screen.getByText("En attente (1)");
      expect(contentPending).toBeTruthy();
      const contentRefused = await screen.getByText("Refusé (2)");
      expect(contentRefused).toBeTruthy();
      expect(screen.getByTestId("big-billed-icon")).toBeTruthy();
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
            type: "Admin",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.Dashboard);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Dashboard);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
