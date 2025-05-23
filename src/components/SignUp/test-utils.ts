import { fireEvent, screen } from "@testing-library/react";

export const fillSignUpForm = (
  username: string,
  email: string,
  password: string
) => {
  fireEvent.change(screen.getByLabelText(/user name/i), {
    target: { value: username },
  });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: password },
  });
};
