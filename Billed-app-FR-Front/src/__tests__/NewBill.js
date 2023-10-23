/**
 * @jest-environment jsdom
 */
 
import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then it should see title", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
     const title= screen.getByTestId('title');
      expect(title.textContent.trim()).toBe('Envoyer une note de frais')
    })
  })
})
