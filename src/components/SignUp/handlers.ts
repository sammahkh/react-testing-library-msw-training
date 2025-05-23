import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://api.realworld.io/api/users", () => {
    return HttpResponse.json({
      status: 200,
      data: {
        username: "test",
        email: "test@example.com",
      },
    });
  }),
];

export const failureHandlers = [
  http.post("https://api.realworld.io/api/users", () => {
    return HttpResponse.json({ message: "Network Error" }, { status: 530 });
  }),
];
