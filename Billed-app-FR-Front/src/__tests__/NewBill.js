import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { render, screen, fireEvent } from "@testing-library/dom";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should see title", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const title = screen.getByTestId("title");
      expect(title.textContent.trim()).toBe("Envoyer une note de frais");
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

    it("should create an instance of NewBill", () => {
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
