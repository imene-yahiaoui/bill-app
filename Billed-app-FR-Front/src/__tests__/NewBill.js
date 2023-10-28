import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { render, screen, fireEvent } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

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
    //vat
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

/**Test de la création d'une instance */
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
      const handleChangeFile = jest.fn(screen.handleChangeFile);
      const files = screen.getAllByTestId("file");
      //cree mock pour event
      files.forEach((file) => {
        const event = {
          preventDefault: jest.fn(),
          target: file,
        };
        handleChangeFile(event);
        expect(handleChangeFile).toHaveBeenCalledWith(event);
      });
    });

    // Mock des dépendances
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
        .mockReturnValue(JSON.stringify({ email: "UserEmail" })),
    };

    it("Then should create an instance of NewBill", () => {
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
  });
});
