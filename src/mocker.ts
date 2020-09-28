import faker from "faker";

import * as Api from "./types";

export const fakeMeSomeData = (): Array<Api.Post> => [
  {
    id: faker.random.alpha({ count: 12 }),
    title: faker.lorem.words(8),
    body: faker.lorem.paragraph(3),
    createdAt: faker.date.recent(7).toUTCString(),
  },
];
