import faker from "faker";

import { ApiPost } from "./types";

const uniqueId = () => faker.random.alpha({ count: 12 });

export const fakeMeSomeData = (): Array<ApiPost> => [
  {
    id: uniqueId(),
    title: faker.lorem.words(8),
    body: faker.lorem.paragraph(3),
    createdAt: faker.date.recent(7).toUTCString(),
    user: {
      id: uniqueId(),
      handle: faker.internet.userName(), // email instead?
      imgUrl: faker.internet.avatar(),
    },
    // comments: [
    //   {
    //     id: uniqueId(),
    //     body: faker.lorem.paragraph(3),
    //   },
    // ],
  },
];
