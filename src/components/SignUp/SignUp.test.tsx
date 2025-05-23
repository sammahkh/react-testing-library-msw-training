import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUp from "./";
import React from "react";
import { setupServer } from "msw/node";
import { failureHandlers, handlers } from "./handlers";
import { http, HttpResponse } from "msw";
import { fillSignUpForm } from "./test-utils";
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
server.events.on("request:start", ({ request }) => {
  console.log("MSW intercepted:", request.method, request.url);
});
describe("SignUp Component", () => {
  describe("Validation", () => {
    it("should display validation errors for invalid email", async () => {
      render(<SignUp />);

      const emailField = screen.getByLabelText(/email address/i);
      fireEvent.change(emailField, { target: { value: "" } });
      fireEvent.blur(emailField);
      expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
      fireEvent.change(emailField, { target: { value: "samah-" } });
      fireEvent.blur(emailField);
      expect(
        await screen.findByText(/Enter a valid email/i)
      ).toBeInTheDocument();
    });

    it("should display validation errors for short password", async () => {
      render(<SignUp />);
      const passwordField = screen.getByLabelText(/password/i);
      fireEvent.change(passwordField, { target: { value: "123" } });
      fireEvent.blur(passwordField);
      expect(
        await screen.findByText(
          /Password should be of minimum 8 characters length/i
        )
      ).toBeInTheDocument();
    });

    it("should display success message on successful sign-up", async () => {
      render(<SignUp />);
      fillSignUpForm("test", "test@example.com", "12345678");
      fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
      expect(
        await screen.findByText(/Sign Up Successfully!/i)
      ).toBeInTheDocument();
    });

    it("should display error message on sign-up failure", async () => {
      render(<SignUp />);
      server.use(...failureHandlers);
      fireEvent.change(screen.getByLabelText(/user name/i), {
        target: { value: "test" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "12345678" },
      });
      fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

      expect(await screen.findByText(/Error Signing Up!/i)).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("should enable Sign Up button when form is valid", async () => {
      render(<SignUp />);
      fillSignUpForm("test", "test@example.com", "12345678");
      expect(screen.getByRole("button", { name: /Sign up/i })).toBeEnabled();
    });

    it("should disable Sign Up button when form is invalid", async () => {
      render(<SignUp />);
      fillSignUpForm("test", "testexample.com", "12345678");
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Sign up/i })).toBeDisabled();
      });
    });

    it("should update form fields on user input", async () => {
      render(<SignUp />);
      fillSignUpForm("test", "test@example.com", "12345678");
      expect(
        (screen.getByLabelText(/user name/i) as HTMLInputElement).value
      ).toBe("test");
      expect(
        (screen.getByLabelText(/email address/i) as HTMLInputElement).value
      ).toBe("test@example.com");
      expect(
        (screen.getByLabelText(/password/i) as HTMLInputElement).value
      ).toBe("12345678");
    });
    it("should redirect user to home page after successful signup", async () => {
      render(<SignUp />);
      fillSignUpForm("test", "test@example.com", "12345678");
      fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
      await waitFor(() => {
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      });
    });
  });
});
