import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { render, screen, fireEvent, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import store from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { bills } from "../fixtures/bills.js";
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";
import mockStore from "../__mocks__/store";
jest?.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should see title", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const title = screen.getByTestId("title");
      expect(title.textContent.trim()).toBe("Envoyer une note de frais");
    });
    test("Then it should see input Name of expense", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputName = screen.getByTestId("expense-name");
      expect(inputName).toBeTruthy();
    });
    test("Then it should see input datepicker of expense", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const datepicker = screen.getByTestId("datepicker");
      expect(datepicker).toBeTruthy();
    });

    test("Then it should see input vat and pct of expense", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const vat = screen.getByTestId("vat");
      const pct = screen.getByTestId("pct");
      expect(vat).toBeTruthy();
      expect(pct).toBeTruthy();
    });
    test("Then it should renders NewBill page", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const inputExpenseName = screen.getByTestId("expense-name");
      expect(inputExpenseName.value).toBe("");
      const inputAmount = screen.getByTestId("amount");
      expect(inputAmount.value).toBe("");
      const formNewBill = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn((e) => e.preventDefault());
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });
});

/**NewBill constainer */

describe("Given I am connected as an employee", () => {
  describe("When I am submite a NewBill Page,i should  creat NewBill", () => {
    it("Then handleChangeFile function should be called", () => {
      const handleChangeFile = jest.fn(screen.handleChangeFile);
      const files = screen.getAllByTestId("file");

      files.forEach((file) => {
        file.addEventListener("click", handleChangeFile);
        userEvent.click(file);
      });
      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toHaveBeenCalledTimes(files.length);
    });
    it("Then handleChangeFile function should be called with event", () => {
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      const event = { preventDefault: jest.fn() };
      newBill.handleChangeFile(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("Then handleChangeFile function should be update properties", async () => {
      const storeMock = {
        bills: () => {
          return {
            create: jest.fn().mockResolvedValue([bills[0]]),
          };
        },
      };

      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: storeMock,
        localStorage: null,
      });
      const event = { preventDefault: jest.fn() };
      await newBill.handleChangeFile(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(bills[0].fileUrl).toBe(
        "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a"
      );
      expect(bills[0].fileName).toBe("preview-facture-free-201801-pdf-1.jpg");
      expect(bills[0].id).toBe("47qAXb6fIm2zOKkLzMro");
    });

    it("Then should create an instance of NewBill", () => {
      const mockDocument = document;
      const mockOnNavigate = jest.fn();
      const mockStore = {
        bills: {
          create: jest.fn().mockResolvedValue({ fileUrl: "Url", key: "Key" }),
          update: jest.fn().mockResolvedValue({}),
        },
      };
      const mockLocalStorage = {
        getItem: jest
          .fn()
          .mockReturnValue(JSON.stringify({ email: "employee@test.tld" })),
      };
      const newBillInstance = new NewBill({
        document: mockDocument,
        onNavigate: mockOnNavigate,
        store: mockStore,
        localStorage: mockLocalStorage,
      });

      expect(newBillInstance).toBeInstanceOf(NewBill);
      expect(newBillInstance.document).toBe(mockDocument);
      expect(newBillInstance.onNavigate).toBe(mockOnNavigate);
      expect(newBillInstance.store).toBe(mockStore);
    });

    it("Then should handle errors with catch", async () => {
      const storeMock = {
        bills: () => {
          return {
            create: jest
              .fn()
              .mockRejectedValue(new Error("Some error message")),
          };
        },
      };
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: storeMock,
        localStorage: null,
      });
      const e = { preventDefault: jest.fn() };
      try {
        await newBill.handleChangeFile(e);
      } catch (error) {
        expect(error.message).toBe("Some error message");
      }
    });
  });

  describe("When I click on send btn", () => {
    it("Then onNavigate should be called with ROUTES_PATH['Bills']", () => {
      //add mock for onNavigate
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: null,
        localStorage: null,
      });
      const send = document.createElement("button");
      send.setAttribute("id", "btn-send-bill");
      document.body.appendChild(send);
      const e = { preventDefault: jest.fn() };
      newBill.handleSubmit(e);
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
    });
  });

  describe("When I update Bill", () => {
    it("Then onNavigate should be called", () => {
      const storeMock = {
        bills: () => ({
          update: jest.fn().mockResolvedValue({}),
        }),
      };
      const onNavigate = jest.fn();
      const newBills = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: storeMock,
        localStorage: null,
      });
      const bill = {
        email: "test@gmail.com",
        type: "Vol Paris Marseille",
        date: "22 Nov. 21",
        amount: "240 €",
        vat: "230",
        pct: "10",
        commentary: "test",
        fileUrl:
          "http://localhost:5678/public/4b392f446047ced066990b0627cfa444",
        fileName: "photo.png",
        status: "pending",
      };
      const send = document.createElement("button");
      send.setAttribute("id", "btn-send-bill");
      document.body.appendChild(send);
      newBills.updateBill(bill);
      userEvent.click(send);
      const e = { preventDefault: jest.fn() };
      try {
        newBills.handleSubmit(e);
        expect(onNavigate).toHaveBeenCalled();
        expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });

    it("Then should handle errors with catch", async () => {
      const storeMock = {
        bills: () => {
          return {
            update: jest
              .fn()
              .mockRejectedValue(new Error("Some error message")),
          };
        },
      };
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document: document,
        onNavigate: onNavigate,
        store: storeMock,
        localStorage: null,
      });
      const e = jest.fn();
      try {
        await newBill.updateBill(e);
      } catch (error) {
        expect(error.message).toBe("Some error message");
      }
    });
  });
});

/**
 * test integration POST
 */

describe("Given I am a user connected as Employee", () => {
  describe("When I click on the 'new bill' button", () => {
    beforeEach(() => {
      jest.spyOn(store, "bills");
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

    it("Then create a new bills from mock API POST", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname,
        });
      };
      window.onNavigate(ROUTES_PATH.NewBill);

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = NewBillUI();
      const inputType = screen.getByTestId("expense-type");
      const inputName = screen.getByTestId("expense-name");
      const inputDate = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVAT = screen.getByTestId("vat");
      const inputPCT = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");
      expect(inputType).toBeTruthy();
      expect(inputName).toBeTruthy();
      expect(inputDate).toBeTruthy();
      expect(inputAmount).toBeTruthy();
      expect(inputVAT).toBeTruthy();
      expect(inputPCT).toBeTruthy();
      expect(inputCommentary).toBeTruthy();
      expect(inputFile).toBeTruthy();
      userEvent.type(inputType, "Services en ligne");
      userEvent.type(inputName, "test3");
      userEvent.type(inputDate, "2003-03-03");
      userEvent.type(inputAmount, "300");
      userEvent.type(inputVAT, "60");
      userEvent.type(inputPCT, "20");
      userEvent.type(inputCommentary, "facteure");
      newBill.fileName = "facture-clien";
      newBill.fileUrl =
        "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3";
      const email = "e@e";

      const bill = [
        {
          id: "UIUZtnPQvnbFnB0ozvJh",
          vat: "60",
          fileUrl:
            "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
          status: "pending",
          type: "Services en ligne",
          commentary: "facteure",
          name: "encore",
          fileName:
            "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
          date: "2004-04-04",
          amount: 400,
          commentAdmin: "ok",
          email: "a@a",
          pct: 20,
        },
      ];

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const handleSubmit = jest.spyOn(newBill, "handleSubmit");
      const NewBillForm = screen.getByTestId("form-new-bill");
      mockStore.bills.mockImplementation(() => {
        return {
          create: () => {
            return Promise.resolve({
              fileUrl: `${newBill.fileUrl}`,
              key: "1234",
            });
          },
          update: () => {
            return Promise.resolve({
              id: "UIUZtnPQvnbFnB0ozvJh",
              vat: "60",
              fileUrl:
                "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
              status: "pending",
              type: "Services en ligne",
              commentary: "facteure",
              name: "encore",
              fileName:
                "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
              date: "2003-03-03",
              amount: 300,
              commentAdmin: "ok",
              email: "a@a",
              pct: 20,
            });
          },
        };
      });

      inputFile.addEventListener("change", handleChangeFile);
      NewBillForm.addEventListener("submit", handleSubmit);
      userEvent.upload(
        inputFile,
        new File(["(--[IMG]--)"], "factureClient.jpg", {
          type: "image/jpg",
        })
      );
      //click sur envoyer
      fireEvent.submit(NewBillForm);

      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toBeCalled();
      expect(handleSubmit).toHaveBeenCalled();
      expect(mockStore.bills).toHaveBeenCalled();
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });

    describe("When an error occurs on API", () => {
      it("Then fetches messages from an API and fails with 500 message error", async () => {
        const html = BillsUI({ error: "Erreur 404" });
        document.body.innerHTML = html;
        const message = await screen.getByText("Erreur 404");
        expect(message).toBeTruthy();
      });

      it("Then fetches messages from an API and fails with 500 message error", async () => {
        const html = BillsUI({ error: "Erreur 500" });
        document.body.innerHTML = html;
        const message = await screen.getByText("Erreur 500");
        expect(message).toBeTruthy();
      });
    });
  });
});
